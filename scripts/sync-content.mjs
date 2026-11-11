
import * as cheerio from "cheerio";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rssFeedUrl = "https://www.jw.org/en/whats-new/rss/WhatsNewWebArticles/feed.xml";
const videoFeedUrl = "https://b.jw-cdn.org/apis/mediator/v1/categories/E/LatestVideos?detailed=1&clientType=www";
const defaultSupabaseUrl = "https://fgikbmwjdentpumhdzeu.supabase.co";
const minimumArticleCount = 10;
const minimumVideoCount = 3;

function cleanText(value) {
  return String(value || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value) {
  return cleanText(value).toLocaleLowerCase("en");
}

function titleCaseCategory(value) {
  return cleanText(value)
    .toLocaleLowerCase("en")
    .replace(/(^|[\s—-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("en"));
}

function videoIdFromUrl(url) {
  const lank = new URL(url).searchParams.get("lank");
  if (!lank) throw new Error(`Video link has no lank value: ${url}`);
  return lank.toLocaleLowerCase("en").replace(/_/g, "-");
}

function inferVideoCategory(title) {
  if (/governing body update/i.test(title)) return "Governing Body Updates";
  if (/^jw broadcasting/i.test(title)) return "JW Broadcasting";
  if (/^was it designed\?/i.test(title)) return "Was It Designed?";
  if (/\([A-Za-z]+\.\s*\d+[:.]\d+\)$/.test(title)) return "Morning Worship";
  return "Latest Videos";
}

export function parseWhatsNewRss(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles = [];

  $("channel > item").each((index, item) => {
    const entry = $(item);
    const id = cleanText(entry.find("guid").first().text());
    const feedTitle = cleanText(entry.find("title").first().text());
    const link = cleanText(entry.find("link").first().text());
    const pubDate = cleanText(entry.find("pubDate").first().text());

    if (!id || !feedTitle || !link || !pubDate) return;

    const separator = feedTitle.indexOf("|");
    if (separator === -1) {
      throw new Error(`RSS title has no category separator: ${feedTitle}`);
    }

    const category = titleCaseCategory(feedTitle.slice(0, separator));
    const title = cleanText(feedTitle.slice(separator + 1));
    const publicationTimestamp = Date.parse(pubDate);

    if (!title || !category || !Number.isFinite(publicationTimestamp)) {
      throw new Error(`Invalid RSS article data: ${feedTitle}`);
    }

    const url = new URL(link);
    if (url.hostname !== "www.jw.org" || url.protocol !== "https:") {
      throw new Error(`Unexpected article URL: ${link}`);
    }

    const descriptionHtml = entry.find("description").first().text();
    const descriptionDom = cheerio.load(descriptionHtml);
    const description = cleanText(descriptionDom("body").text());

    articles.push({
      id,
      publication_date: new Date(publicationTimestamp).toISOString().slice(0, 10),
      category,
      title,
      description,
      type: "article",
      url: url.href,
      published: true,
      sort_order: index
    });
  });

  return articles;
}

export function parseLatestVideos(data) {
  const media = Array.isArray(data?.category?.media) ? data.category.media : [];

  return media.map((video, index) => {
    const title = cleanText(video.title);
    const lank = cleanText(video.languageAgnosticNaturalKey);
    const publicationDate = cleanText(video.firstPublished).slice(0, 10);

    if (!title || !lank || !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) {
      return null;
    }

    const url = `https://www.jw.org/finder?locale=en&lank=${encodeURIComponent(lank)}&docid=1011214&applanguage=E`;

    return {
      id: videoIdFromUrl(url),
      publication_date: publicationDate,
      category: inferVideoCategory(title),
      title,
      description: cleanText(video.durationFormattedHHMM || video.durationFormattedMinSec),
      type: "video",
      url,
      published: true,
      sort_order: index
    };
  }).filter(Boolean);
}

function validateCatalog({ articles, videos }) {
  if (articles.length < minimumArticleCount) {
    throw new Error(`Safety check failed: found only ${articles.length} articles.`);
  }

  if (videos.length < minimumVideoCount) {
    throw new Error(`Safety check failed: found only ${videos.length} videos.`);
  }

  const ids = [...articles, ...videos].map((item) => item.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Safety check failed: duplicate item IDs found.");
  }
}

function supabaseHeaders(secretKey, extra = {}) {
  const headers = { apikey: secretKey, ...extra };
  if (!secretKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${secretKey}`;
  }
  return headers;
}

async function readResponse(response, label) {
  if (response.ok) {
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  throw new Error(`${label} failed (${response.status}): ${await response.text()}`);
}

async function loadExistingItems(supabaseUrl, secretKey) {
  const query = new URL("/rest/v1/content_items", supabaseUrl);
  query.searchParams.set(
    "select",
    "id,publication_date,category,title,description,type,url,published,sort_order"
  );

  const response = await fetch(query, {
    headers: supabaseHeaders(secretKey)
  });

  return readResponse(response, "Loading existing content");
}

export function resolveStableIds(scrapedItems, existingItems) {
  const existingVideos = new Map(
    existingItems
      .filter((item) => item.type === "video")
      .map((item) => [`video|${item.url}`, item])
  );

  return scrapedItems.map((item) => {
    // Article IDs are the RSS GUIDs.
    if (item.type === "article") return item;

    // Preserve existing video IDs by matching their URLs.
    const existing = existingVideos.get(`video|${item.url}`);

    if (!existing) return item;

    return {
      ...item,
      id: existing.id,
      category: item.category === "Latest Videos" ? existing.category : item.category
    };
  });
}

async function upsertItems(supabaseUrl, secretKey, items) {
  const endpoint = new URL("/rest/v1/content_items?on_conflict=id", supabaseUrl);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: supabaseHeaders(secretKey, {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    }),
    body: JSON.stringify(items)
  });

  await readResponse(response, "Updating content");
}

async function unpublishMissingItems(supabaseUrl, secretKey, existingItems, currentIds) {
  const staleIds = existingItems
    .filter((item) => item.published && !currentIds.has(item.id))
    .map((item) => item.id);

  if (!staleIds.length) return 0;

  const endpoint = new URL("/rest/v1/content_items", supabaseUrl);
  endpoint.searchParams.set(
    "id",
    `in.(${staleIds.map((id) => `"${id.replaceAll('"', '\\"')}"`).join(",")})`
  );

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: supabaseHeaders(secretKey, {
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    }),
    body: JSON.stringify({
      published: false,
      updated_at: new Date().toISOString()
    })
  });

  await readResponse(response, "Removing old content");
  return staleIds.length;
}

async function fetchWhatsNewRss() {
  const response = await fetch(rssFeedUrl, {
    headers: {
      Accept: "application/rss+xml,application/xml,text/xml",
      "User-Agent": "JWTrack/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`JW.org RSS request failed (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!/xml|rss/i.test(contentType)) {
    throw new Error(`Unexpected RSS content type: ${contentType}`);
  }

  return response.text();
}

async function fetchLatestVideos() {
  const response = await fetch(videoFeedUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "JWTrack/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`JW.org video request failed (${response.status}).`);
  }

  return response.json();
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabaseUrl = process.env.SUPABASE_URL || defaultSupabaseUrl;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is required.");
  }

  const [rssXml, videoData] = await Promise.all([
    fetchWhatsNewRss(),
    fetchLatestVideos()
  ]);

  const catalog = {
    articles: parseWhatsNewRss(rssXml),
    videos: parseLatestVideos(videoData)
  };

  const videoTitles = new Set(catalog.videos.map((item) => normalizeTitle(item.title)));
  catalog.articles = catalog.articles.filter(
    (item) => !videoTitles.has(normalizeTitle(item.title))
  );

  validateCatalog(catalog);

  const existingItems = await loadExistingItems(supabaseUrl, secretKey);
  const scrapedItems = resolveStableIds(
    [...catalog.videos, ...catalog.articles],
    existingItems
  );

  const existingIds = new Set(existingItems.map((item) => item.id));
  const newItems = scrapedItems.filter((item) => !existingIds.has(item.id));

  console.log(`Found ${catalog.articles.length} articles and ${catalog.videos.length} videos.`);
  console.log(`New items: ${newItems.length}.`);

  if (dryRun) {
    for (const item of newItems) {
      console.log(`- ${item.type} [${item.id}]: ${item.title}`);
    }
    return;
  }

  await upsertItems(supabaseUrl, secretKey, scrapedItems);

  const unpublishedCount = await unpublishMissingItems(
    supabaseUrl,
    secretKey,
    existingItems,
    new Set(scrapedItems.map((item) => item.id))
  );

  console.log(
    `Updated ${scrapedItems.length} items and unpublished ${unpublishedCount} old items.`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

import * as cheerio from "cheerio";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const sourceUrl = "https://www.jw.org/en/whats-new/";
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

function absoluteUrl(value) {
  return new URL(value, sourceUrl).href;
}

function videoIdFromUrl(url) {
  const lank = new URL(url).searchParams.get("lank");
  if (!lank) throw new Error(`Video link has no lank value: ${url}`);
  return `${lank.toLocaleLowerCase("en").replace(/_/g, "-")}`;
}

function articleIdFromCard($, card, url) {
  const className = $(card).attr("class") || "";
  const docId = className.match(/\bdocId-(\d+)\b/)?.[1];
  if (docId) return `docid-${docId}-article`;

  const pageId = $(card).find("a[data-page-id]").attr("data-page-id")?.replace(/^mid/, "");
  if (pageId) return `docid-${pageId}-article`;

  const slug = new URL(url).pathname.split("/").filter(Boolean).pop();
  if (!slug) throw new Error(`Article link has no usable ID: ${url}`);
  return `article-${slug.toLocaleLowerCase("en")}`;
}

function inferVideoCategory(title) {
  if (/governing body update/i.test(title)) return "Governing Body Updates";
  if (/^jw broadcasting/i.test(title)) return "JW Broadcasting";
  if (/^was it designed\?/i.test(title)) return "Was It Designed?";
  if (/\([A-Za-z]+\.\s*\d+[:.]\d+\)$/.test(title)) return "Morning Worship";
  return "Latest Videos";
}

export function parseWhatsNew(html) {
  const $ = cheerio.load(html);
  const videosById = new Map();

  $('.cmm-widget[data-source-cat="LatestVideos"] .synopsis').each((index, card) => {
    const titleLink = $(card).find("h3 a").first();
    const title = cleanText(titleLink.text());
    const href = titleLink.attr("href");
    const publicationDate = cleanText($(card).find(".contextTtl").first().text());
    if (!title || !href || !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) return;

    const url = absoluteUrl(href);
    const id = videoIdFromUrl(url);
    if (!videosById.has(id)) {
      videosById.set(id, {
        id,
        publication_date: publicationDate,
        category: inferVideoCategory(title),
        title,
        description: cleanText($(card).find(".syn-img-overlay-text").first().text()),
        type: "video",
        url,
        published: true,
        sort_order: index
      });
    }
  });

  const videoTitles = new Set([...videosById.values()].map((item) => normalizeTitle(item.title)));
  const articles = [];

  $(".whatsNewItems .synopsis").each((index, card) => {
    const titleLink = $(card).find("h3 a").first();
    const title = cleanText(titleLink.text());
    const href = titleLink.attr("href");
    const publicationDate = cleanText($(card).find(".pubDate").first().text());
    if (!title || !href || !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) return;
    if (videoTitles.has(normalizeTitle(title))) return;

    const url = absoluteUrl(href);
    articles.push({
      id: articleIdFromCard($, card, url),
      publication_date: publicationDate,
      category: titleCaseCategory($(card).find(".contextTitle").first().text()) || "Other",
      title,
      description: cleanText($(card).find("p.desc").first().text()),
      type: "article",
      url,
      published: true,
      sort_order: index
    });
  });

  return { articles, videos: [...videosById.values()] };
}

export function parseLatestVideos(data) {
  const media = Array.isArray(data?.category?.media) ? data.category.media : [];
  return media.map((video, index) => {
    const title = cleanText(video.title);
    const lank = cleanText(video.languageAgnosticNaturalKey);
    const publicationDate = cleanText(video.firstPublished).slice(0, 10);
    if (!title || !lank || !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) return null;

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
  if (new Set(ids).size !== ids.length) throw new Error("Safety check failed: duplicate item IDs found.");
}

function supabaseHeaders(secretKey, extra = {}) {
  const headers = { apikey: secretKey, ...extra };
  if (!secretKey.startsWith("sb_secret_")) headers.Authorization = `Bearer ${secretKey}`;
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
  query.searchParams.set("select", "id,publication_date,category,title,description,type,url,published,sort_order");
  const response = await fetch(query, { headers: supabaseHeaders(secretKey) });
  return readResponse(response, "Loading existing content");
}

function resolveStableIds(scrapedItems, existingItems) {
  const byUrlAndType = new Map(existingItems.map((item) => [`${item.type}|${item.url}`, item]));
  const byTitleAndType = new Map(
    existingItems.map((item) => [`${item.type}|${normalizeTitle(item.title)}`, item])
  );

  return scrapedItems.map((item) => {
    const existing = byUrlAndType.get(`${item.type}|${item.url}`)
      || byTitleAndType.get(`${item.type}|${normalizeTitle(item.title)}`);
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
  endpoint.searchParams.set("id", `in.(${staleIds.map((id) => `"${id.replaceAll('"', '\\"')}"`).join(",")})`);
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: supabaseHeaders(secretKey, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ published: false, updated_at: new Date().toISOString() })
  });
  await readResponse(response, "Removing old content");
  return staleIds.length;
}

function escapeHtml(value) {
  return cleanText(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

async function sendNotification(apiKey, recipient, sender, newItems) {
  const itemWord = newItems.length === 1 ? "item" : "items";
  const rows = newItems.map((item) => `
    <li style="margin-bottom: 14px">
      <strong>${escapeHtml(item.type === "video" ? "Video" : "Article")}</strong><br>
      <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a><br>
      <span style="color: #666">${escapeHtml(item.publication_date)}</span>
    </li>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `jwtrack-${newItems.map((item) => item.id).sort().join("-")}`.slice(0, 256)
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `${newItems.length} new JW.org ${itemWord}`,
      html: `<h2>New on JW.org</h2><ul style="padding-left: 20px">${rows}</ul>`
    })
  });
  await readResponse(response, "Sending notification email");
}

async function fetchSource() {
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (compatible; JWTrack/1.0; +https://github.com/eshellborn/jwtrack)"
    }
  });
  if (!response.ok) throw new Error(`JW.org request failed (${response.status}).`);
  return response.text();
}

async function fetchLatestVideos() {
  const response = await fetch(videoFeedUrl, {
    headers: { Accept: "application/json", "User-Agent": "JWTrack/1.0" }
  });
  if (!response.ok) throw new Error(`JW.org video request failed (${response.status}).`);
  return response.json();
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabaseUrl = process.env.SUPABASE_URL || defaultSupabaseUrl;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is required.");

  const [html, videoData] = await Promise.all([fetchSource(), fetchLatestVideos()]);
  const catalog = parseWhatsNew(html);
  catalog.videos = parseLatestVideos(videoData);
  validateCatalog(catalog);
  const existingItems = await loadExistingItems(supabaseUrl, secretKey);
  const scrapedItems = resolveStableIds([...catalog.videos, ...catalog.articles], existingItems);
  const existingIds = new Set(existingItems.map((item) => item.id));
  const newItems = scrapedItems.filter((item) => !existingIds.has(item.id));

  console.log(`Found ${catalog.articles.length} articles and ${catalog.videos.length} videos.`);
  console.log(`New items: ${newItems.length}.`);
  if (dryRun) {
    for (const item of newItems) console.log(`- ${item.type}: ${item.title}`);
    return;
  }

  if (newItems.length) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!resendApiKey || !notificationEmail) {
      throw new Error("New content was found, but RESEND_API_KEY or NOTIFICATION_EMAIL is missing.");
    }
    await sendNotification(
      resendApiKey,
      notificationEmail,
      process.env.RESEND_FROM_EMAIL || "JW Track <onboarding@resend.dev>",
      newItems
    );
    console.log(`Sent a notification for ${newItems.length} new item(s).`);
  }

  await upsertItems(supabaseUrl, secretKey, scrapedItems);
  const unpublishedCount = await unpublishMissingItems(
    supabaseUrl,
    secretKey,
    existingItems,
    new Set(scrapedItems.map((item) => item.id))
  );
  console.log(`Updated ${scrapedItems.length} items and unpublished ${unpublishedCount} old items.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

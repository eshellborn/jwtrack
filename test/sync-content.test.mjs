
import test from "node:test";
import assert from "node:assert/strict";

import {
  parseLatestVideos,
  parseWhatsNewRss,
  resolveStableIds
} from "../scripts/sync-content.mjs";

test("parses JW.org RSS articles using their GUIDs", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <item>
          <guid isPermaLink="false">9aa76b60ba27e0b38cf5dfa4ab64140d</guid>
          <title>NEWS RELEASES | Three Brothers Released From Prison in Russia</title>
          <link>https://www.jw.org/en/news/three-brothers/</link>
          <pubDate>Fri, 06 Nov 2026 00:00:00 +0000</pubDate>
          <description><![CDATA[<p>Example description.</p>]]></description>
        </item>
        <item>
          <guid isPermaLink="false">aff47191bb7ceaa4d81d26a577e43b20</guid>
          <title>LIFE STORIES | An Example Article</title>
          <link>https://www.jw.org/en/library/example/</link>
          <pubDate>Wed, 04 Nov 2026 00:00:00 +0000</pubDate>
          <description><![CDATA[<p>A useful description.</p>]]></description>
        </item>
      </channel>
    </rss>`;

  const result = parseWhatsNewRss(xml);

  assert.equal(result.length, 2);

  assert.equal(
    result[0].id,
    "9aa76b60ba27e0b38cf5dfa4ab64140d"
  );
  assert.equal(result[0].title, "Three Brothers Released From Prison in Russia");
  assert.equal(result[0].category, "News Releases");
  assert.equal(result[0].publication_date, "2026-11-06");
  assert.equal(result[0].type, "article");

  assert.equal(
    result[1].id,
    "aff47191bb7ceaa4d81d26a577e43b20"
  );
  assert.equal(result[1].category, "Life Stories");
  assert.equal(result[1].description, "A useful description.");
});

test("parses the JW.org latest-videos feed", () => {
  const result = parseLatestVideos({
    category: {
      media: [{
        languageAgnosticNaturalKey: "docid-123_1_VIDEO",
        title: "Was It Designed? Example",
        firstPublished: "2026-06-14T10:30:00Z",
        durationFormattedHHMM: "3:21"
      }]
    }
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "docid-123-1-video");
  assert.equal(result[0].publication_date, "2026-06-14");
  assert.equal(result[0].description, "3:21");
});

test("preserves existing video IDs while using RSS GUIDs for articles", () => {
  const scrapedItems = [
    {
      id: "new-video-id",
      type: "video",
      url: "https://www.jw.org/finder?lank=video123",
      category: "Latest Videos"
    },
    {
      id: "rss-guid-123",
      type: "article",
      url: "https://www.jw.org/en/library/example/"
    }
  ];

  const existingItems = [
    {
      id: "legacy-video-id",
      type: "video",
      url: "https://www.jw.org/finder?lank=video123",
      category: "Original Category"
    },
    {
      id: "legacy-article-id",
      type: "article",
      url: "https://www.jw.org/en/library/example/"
    }
  ];

  const result = resolveStableIds(scrapedItems, existingItems);

  assert.equal(result[0].id, "legacy-video-id");
  assert.equal(result[0].category, "Original Category");
  assert.equal(result[1].id, "rss-guid-123");
});

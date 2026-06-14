import test from "node:test";
import assert from "node:assert/strict";
import { parseWhatsNew } from "../scripts/sync-content.mjs";

test("parses videos and articles while preferring a duplicate video", () => {
  const html = `
    <div class="cmm-widget" data-source-cat="LatestVideos">
      <div class="synopsis">
        <div class="syn-img-overlay-text">4:12</div>
        <h3><a href="https://www.jw.org/finder?locale=en&lank=docid-123_1_VIDEO">Same title</a></h3>
        <p class="contextTtl">2026-06-14</p>
      </div>
    </div>
    <div class="whatsNewItems">
      <div class="synopsis docId-123">
        <p class="meta pubDate">2026-06-14</p>
        <p class="contextTitle">NEWS RELEASES</p>
        <h3><a href="/en/news/same-title/">Same title</a></h3>
      </div>
      <div class="synopsis docId-456">
        <p class="meta pubDate">2026-06-13</p>
        <p class="contextTitle">LIFE STORIES</p>
        <h3><a href="/en/library/example/">An article</a></h3>
        <p class="desc">A useful description.</p>
      </div>
    </div>`;

  const result = parseWhatsNew(html);
  assert.equal(result.videos.length, 1);
  assert.equal(result.videos[0].id, "docid-123-1-video");
  assert.equal(result.videos[0].description, "4:12");
  assert.equal(result.articles.length, 1);
  assert.equal(result.articles[0].id, "docid-456-article");
  assert.equal(result.articles[0].category, "Life Stories");
});

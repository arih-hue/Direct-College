import { fetchRenderedHtml } from "./browser.js";
import { extractBasicMetadata } from "./cheerioExtract.js";
import type { ScraperFn } from "./types.js";

export const scrapeCollegeWebsite: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl;
  if (!url) {
    throw new Error("COLLEGE_WEBSITE scrape requires targetUrl.");
  }
  await ctx.log("info", `College site: fetching ${url}`);
  try {
    const html = await fetchRenderedHtml(url);
    return { ...extractBasicMetadata(html, url), meta: { kind: "college" } };
  } catch (err) {
    await ctx.log("warn", "College site: Puppeteer failed, trying static fetch", {
      message: err instanceof Error ? err.message : String(err),
    });
    const res = await fetch(url, { signal: AbortSignal.timeout(45_000) });
    const html = await res.text();
    return { ...extractBasicMetadata(html, url), meta: { kind: "college", fallback: "fetch" } };
  }
};

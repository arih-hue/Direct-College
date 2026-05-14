import { fetchRenderedHtml } from "./browser.js";
import { extractBasicMetadata } from "./cheerioExtract.js";
import type { ScraperFn } from "./types.js";

export const scrapeGovernmentPortal: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl;
  if (!url) {
    throw new Error("GOVERNMENT_PORTAL scrape requires targetUrl in job metadata.");
  }
  await ctx.log("info", `Gov portal: fetching ${url}`);
  const html = await fetchRenderedHtml(url);
  return { ...extractBasicMetadata(html, url), meta: { kind: "government-portal" } };
};

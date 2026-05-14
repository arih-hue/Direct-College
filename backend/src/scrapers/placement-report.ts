import * as cheerio from "cheerio";

import type { ScraperFn } from "./types.js";

/**
 * Placement PDFs/HTML reports — extend with PDF text extraction when URLs point to PDFs.
 */
export const scrapePlacementReport: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl;
  if (!url) {
    throw new Error("PLACEMENT_REPORT scrape requires targetUrl.");
  }
  await ctx.log("info", `Placement report: fetching ${url}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("pdf")) {
    await ctx.log("info", "Placement report: PDF detected — use ingestion pipeline for binary parse.");
    return {
      title: url.split("/").pop(),
      meta: { kind: "placement", format: "pdf", contentType },
    };
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  return {
    title: $("title").first().text().trim(),
    rawHtmlLength: html.length,
    meta: { kind: "placement", format: "html" },
  };
};

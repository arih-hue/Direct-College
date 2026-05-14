import * as cheerio from "cheerio";

import type { ScraperFn } from "./types.js";

const DEFAULT_URL = "https://www.nirfindia.org/";

export const scrapeNirf: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl ?? DEFAULT_URL;
  await ctx.log("info", `NIRF: fetching ${url}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    throw new Error(`NIRF fetch failed: ${String(res.status)}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $("title").first().text().trim();
  await ctx.log("info", "NIRF: static fetch ok", { title });
  return {
    title,
    rawHtmlLength: html.length,
    meta: { portal: "NIRF" },
  };
};

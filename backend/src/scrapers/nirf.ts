import * as cheerio from "cheerio";

import { extractBasicMetadata } from "./cheerioExtract.js";
import { fetchWithPolicy } from "./http.js";
import type { ScraperFn } from "./types.js";

const DEFAULT_URL = "https://www.nirfindia.org/";

export const scrapeNirf: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl ?? DEFAULT_URL;
  await ctx.log("info", `NIRF: fetching ${url}`);
  const res = await fetchWithPolicy(url);
  if (!res.ok) {
    throw new Error(`NIRF fetch failed: ${String(res.status)}`);
  }
  const html = await res.text();
  const snapshotUri = ctx.storeSnapshot ? await ctx.storeSnapshot(html, "html") : null;
  const $ = cheerio.load(html);
  const title = $("title").first().text().trim();
  const meta = extractBasicMetadata(html, url);
  await ctx.log("info", "NIRF: static fetch ok", { title });
  return {
    title,
    links: meta.links,
    rawHtmlLength: html.length,
    ...(snapshotUri ? { htmlSnapshotUri: snapshotUri } : {}),
    meta: { portal: "NIRF", rankingLinks: meta.links?.filter((l) => /rank|data|report/i.test(l)).slice(0, 20) },
  };
};

import { fetchRenderedHtml } from "./browser.js";
import { extractBasicMetadata } from "./cheerioExtract.js";
import type { ScraperFn } from "./types.js";

const DEFAULT_URL = "https://josaa.nic.in/";

export const scrapeJosaa: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl ?? DEFAULT_URL;
  await ctx.log("info", `JoSAA: fetching ${url}`);
  const html = await fetchRenderedHtml(url);
  const snapshotUri = ctx.storeSnapshot ? await ctx.storeSnapshot(html, "html") : null;
  const meta = extractBasicMetadata(html, url);
  await ctx.log("info", "JoSAA: parsed document", { title: meta.title, linkCount: meta.links?.length ?? 0 });
  return {
    ...meta,
    ...(snapshotUri ? { htmlSnapshotUri: snapshotUri } : {}),
    meta: { portal: "JoSAA", cutoffLinks: meta.links?.filter((l) => /cutoff|result|seat/i.test(l)).slice(0, 20) },
  };
};

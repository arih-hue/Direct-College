import { fetchRenderedHtml } from "./browser.js";
import { extractBasicMetadata } from "./cheerioExtract.js";
import type { ScraperFn } from "./types.js";

const DEFAULT_URL = "https://csab.nic.in/";

export const scrapeCsab: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl ?? DEFAULT_URL;
  await ctx.log("info", `CSAB: fetching ${url}`);
  const html = await fetchRenderedHtml(url);
  const snapshotUri = ctx.storeSnapshot ? await ctx.storeSnapshot(html, "html") : null;
  const meta = extractBasicMetadata(html, url);
  await ctx.log("info", "CSAB: parsed document", { title: meta.title, linkCount: meta.links?.length ?? 0 });
  return {
    ...meta,
    ...(snapshotUri ? { htmlSnapshotUri: snapshotUri } : {}),
    meta: { portal: "CSAB", cutoffLinks: meta.links?.filter((l) => /cutoff|allot|seat/i.test(l)).slice(0, 20) },
  };
};

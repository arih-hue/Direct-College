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
  const snapshotUri = ctx.storeSnapshot ? await ctx.storeSnapshot(html, "html") : null;
  const meta = extractBasicMetadata(html, url);
  return {
    ...meta,
    ...(snapshotUri ? { htmlSnapshotUri: snapshotUri } : {}),
    meta: {
      kind: "government-portal",
      datasetLinks: meta.links?.filter((l) => /\.(csv|xlsx|pdf|json|xml)(\?|$)/i.test(l)).slice(0, 30),
    },
  };
};

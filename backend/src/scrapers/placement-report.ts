import * as cheerio from "cheerio";

import { fetchWithPolicy } from "./http.js";
import { saveScrapeBinarySnapshot } from "./snapshotStore.js";
import type { ScraperFn } from "./types.js";

/**
 * Placement PDFs/HTML reports — PDFs are snapshotted and queued for ingestion.
 */
export const scrapePlacementReport: ScraperFn = async (ctx) => {
  const url = ctx.targetUrl;
  if (!url) {
    throw new Error("PLACEMENT_REPORT scrape requires targetUrl.");
  }
  await ctx.log("info", `Placement report: fetching ${url}`);
  const res = await fetchWithPolicy(url, { timeoutMs: 90_000 });
  if (!res.ok) {
    throw new Error(`Placement report fetch failed: ${String(res.status)}`);
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("pdf")) {
    const buf = Buffer.from(await res.arrayBuffer());
    let snapshotUri: string | null = null;
    if (ctx.scrapeJobId) {
      snapshotUri = await saveScrapeBinarySnapshot(ctx.scrapeJobId, buf, "pdf");
    }
    await ctx.log("info", "Placement report: PDF stored for ingestion pipeline", { bytes: buf.length });
    return {
      title: url.split("/").pop(),
      htmlSnapshotUri: snapshotUri ?? undefined,
      meta: { kind: "placement", format: "pdf", contentType, bytes: buf.length },
      ingestionFollowUp: snapshotUri
        ? {
            agency: "placement-report",
            format: "PDF",
            sourceUri: snapshotUri,
            entityType: "placement",
          }
        : undefined,
    };
  }
  const html = await res.text();
  const snapshotUri = ctx.storeSnapshot ? await ctx.storeSnapshot(html, "html") : null;
  const $ = cheerio.load(html);
  return {
    title: $("title").first().text().trim(),
    rawHtmlLength: html.length,
    ...(snapshotUri ? { htmlSnapshotUri: snapshotUri } : {}),
    meta: { kind: "placement", format: "html" },
  };
};

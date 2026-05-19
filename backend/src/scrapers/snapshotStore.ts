import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "../config/env.js";

function storageRoot(): string {
  return env.SCRAPE_STORAGE_DIR ?? path.join(process.cwd(), "data", "scrape-snapshots");
}

/**
 * Persist HTML/text snapshots for audit and re-parse. Returns a `file://` URI.
 */
export async function saveScrapeSnapshot(
  scrapeJobId: string,
  content: string,
  ext = "html",
): Promise<string> {
  const root = storageRoot();
  const dir = path.join(root, scrapeJobId.slice(0, 2), scrapeJobId);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}.${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, content, "utf8");
  return `file://${fullPath.replace(/\\/g, "/")}`;
}

export async function saveScrapeBinarySnapshot(
  scrapeJobId: string,
  buf: Buffer,
  ext: string,
): Promise<string> {
  const root = storageRoot();
  const dir = path.join(root, scrapeJobId.slice(0, 2), scrapeJobId);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}.${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buf);
  return `file://${fullPath.replace(/\\/g, "/")}`;
}

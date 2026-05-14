import * as cheerio from "cheerio";

import type { ScrapeResult } from "./types.js";

export function extractBasicMetadata(html: string, baseUrl?: string): ScrapeResult {
  const $ = cheerio.load(html);
  const title = $("title").first().text().trim() || undefined;
  const links = $("a[href]")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter((h): h is string => Boolean(h))
    .slice(0, 200)
    .map((h) => {
      try {
        if (baseUrl && h.startsWith("/")) {
          return new URL(h, baseUrl).href;
        }
        return h;
      } catch {
        return h;
      }
    });

  return {
    title,
    links: [...new Set(links)],
    excerpt: $("meta[name='description']").attr("content")?.trim(),
    rawHtmlLength: html.length,
  };
}

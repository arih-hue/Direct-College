/**
 * Ethical scraping utilities (robots.txt, rate limits, attribution). Implement per source.
 */
export type ScrapeContext = {
  sourceName: string;
  sourceUrl: string;
};

export async function noopScrape(_ctx: ScrapeContext): Promise<void> {
  await Promise.resolve();
}

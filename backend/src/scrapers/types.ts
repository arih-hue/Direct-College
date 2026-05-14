import type { ScrapeSourceType } from "@prisma/client";

export type ScrapeContext = {
  sourceType: ScrapeSourceType;
  targetUrl?: string | null;
  log: (level: string, message: string, metadata?: Record<string, unknown>) => Promise<void>;
};

export type ScrapeResult = {
  title?: string;
  links?: string[];
  excerpt?: string;
  rawHtmlLength?: number;
  meta?: Record<string, unknown>;
};

export type ScraperFn = (ctx: ScrapeContext) => Promise<ScrapeResult>;

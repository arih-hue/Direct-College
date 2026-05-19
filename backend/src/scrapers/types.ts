import type { ScrapeSourceType } from "@prisma/client";

export type ScrapeContext = {
  sourceType: ScrapeSourceType;
  targetUrl?: string | null;
  scrapeJobId?: string;
  log: (level: string, message: string, metadata?: Record<string, unknown>) => Promise<void>;
  /** Persist HTML/text snapshot; returns storage URI. */
  storeSnapshot?: (content: string, ext?: string) => Promise<string | null>;
};

export type ScrapeResult = {
  title?: string;
  links?: string[];
  excerpt?: string;
  rawHtmlLength?: number;
  htmlSnapshotUri?: string;
  /** When set, enqueue an ingestion job after scrape completes. */
  ingestionFollowUp?: {
    agency: string;
    format: "CSV" | "XLSX" | "PDF" | "JSON" | "XML";
    sourceUri: string;
    entityType?: string;
  };
  meta?: Record<string, unknown>;
};

export type ScraperFn = (ctx: ScrapeContext) => Promise<ScrapeResult>;

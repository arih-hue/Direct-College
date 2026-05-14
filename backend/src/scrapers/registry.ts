import type { ScrapeSourceType } from "@prisma/client";

import { scrapeCollegeWebsite } from "./college-website.js";
import { scrapeCsab } from "./csab.js";
import { scrapeGovernmentPortal } from "./government-portal.js";
import { scrapeJosaa } from "./josaa.js";
import { scrapeNirf } from "./nirf.js";
import { scrapePlacementReport } from "./placement-report.js";
import type { ScraperFn } from "./types.js";

const registry: Record<ScrapeSourceType, ScraperFn> = {
  JOSAA: scrapeJosaa,
  CSAB: scrapeCsab,
  NIRF: scrapeNirf,
  GOVERNMENT_PORTAL: scrapeGovernmentPortal,
  COLLEGE_WEBSITE: scrapeCollegeWebsite,
  PLACEMENT_REPORT: scrapePlacementReport,
};

export function getScraper(sourceType: ScrapeSourceType): ScraperFn {
  return registry[sourceType];
}

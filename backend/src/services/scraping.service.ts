import type { ScrapeSourceType } from "@prisma/client";

import { enqueueScrapeJob } from "../queues/producers.js";
import { scrapeJobRepository } from "../repositories/scrapeJob.repository.js";
import { appCache } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { ScrapeJobListQuery, ScrapeLogsQuery, TriggerScrapeBody } from "../modules/scraping/scraping.schemas.js";

export const scrapingService = {
  async trigger(body: TriggerScrapeBody) {
    return enqueueScrapeJob({
      sourceType: body.sourceType as ScrapeSourceType,
      ...(body.targetUrl !== undefined ? { targetUrl: body.targetUrl } : {}),
      ...(body.metadata !== undefined ? { metadata: body.metadata } : {}),
    });
  },

  async list(query: ScrapeJobListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    return scrapeJobRepository.list({
      take: pageSize,
      skip,
      ...(query.sourceType ? { sourceType: query.sourceType } : {}),
      ...(query.status ? { status: query.status } : {}),
    });
  },

  async getById(id: string) {
    const key = cacheKey(CacheNS.scrape, "job", id);
    const cached = await appCache.getJson<Awaited<ReturnType<typeof scrapeJobRepository.findById>>>(key);
    if (cached) return cached;
    const job = await scrapeJobRepository.findById(id);
    if (job && job.status === "COMPLETED") {
      await appCache.setJson(key, job, CacheTTL.SCRAPE_META);
    }
    return job;
  },

  async logs(scrapeJobId: string, query: ScrapeLogsQuery) {
    const pageSize = clampPageSize(query.pageSize, 200);
    const skip = toSkip(query.page, pageSize);
    return scrapeJobRepository.listLogs(scrapeJobId, pageSize, skip);
  },
};

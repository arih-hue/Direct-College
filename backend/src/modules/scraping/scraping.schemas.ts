import { z } from "zod";

import { paginationQuerySchema } from "../../schemas/common.js";

export const triggerScrapeBodySchema = z.object({
  sourceType: z.enum([
    "JOSAA",
    "CSAB",
    "NIRF",
    "GOVERNMENT_PORTAL",
    "COLLEGE_WEBSITE",
    "PLACEMENT_REPORT",
  ]),
  targetUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const scrapeJobListQuerySchema = paginationQuerySchema.extend({
  sourceType: z
    .enum(["JOSAA", "CSAB", "NIRF", "GOVERNMENT_PORTAL", "COLLEGE_WEBSITE", "PLACEMENT_REPORT"])
    .optional(),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
});

export const scrapeLogsQuerySchema = paginationQuerySchema;

export const scrapeJobIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type TriggerScrapeBody = z.infer<typeof triggerScrapeBodySchema>;
export type ScrapeJobListQuery = z.infer<typeof scrapeJobListQuerySchema>;
export type ScrapeLogsQuery = z.infer<typeof scrapeLogsQuerySchema>;

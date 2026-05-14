import { z } from "zod";

export const analyticsSummaryQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

export type AnalyticsSummaryQuery = z.infer<typeof analyticsSummaryQuerySchema>;

export const analyticsEventBodySchema = z.object({
  name: z.string().min(1).max(120),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventBody = z.infer<typeof analyticsEventBodySchema>;

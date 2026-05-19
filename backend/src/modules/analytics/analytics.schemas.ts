import { z } from "zod";

export const analyticsSummaryQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

export const popularCollegesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const analyticsDaysQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

export const comparisonTrendsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type AnalyticsSummaryQuery = z.infer<typeof analyticsSummaryQuerySchema>;
export type PopularCollegesQuery = z.infer<typeof popularCollegesQuerySchema>;
export type AnalyticsDaysQuery = z.infer<typeof analyticsDaysQuerySchema>;
export type ComparisonTrendsQuery = z.infer<typeof comparisonTrendsQuerySchema>;

export const analyticsEventBodySchema = z.object({
  name: z.string().min(1).max(120),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventBody = z.infer<typeof analyticsEventBodySchema>;

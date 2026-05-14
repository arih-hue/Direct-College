import { z } from "zod";

export const mlPredictBodySchema = z.record(z.string(), z.unknown()).default({});

export const mlRecommendBodySchema = z.object({
  userId: z.string().optional(),
  collegeIds: z.array(z.string()).max(50).optional(),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const mlAnalyzeBodySchema = z.object({
  event: z.string().min(1).max(120),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const mlStrategyBodySchema = z.object({
  rank: z.coerce.number().int().positive(),
  category: z.string().min(1).max(40),
  preferences: z.array(z.string()).max(32).optional(),
});

export type MlPredictBody = z.infer<typeof mlPredictBodySchema>;
export type MlRecommendBody = z.infer<typeof mlRecommendBodySchema>;
export type MlAnalyzeBody = z.infer<typeof mlAnalyzeBodySchema>;
export type MlStrategyBody = z.infer<typeof mlStrategyBodySchema>;

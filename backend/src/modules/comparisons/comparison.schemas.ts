import { z } from "zod";

import { paginationQuerySchema } from "../../schemas/common.js";

export const comparisonHistoryListQuerySchema = paginationQuerySchema;

export type ComparisonHistoryListQuery = z.infer<typeof comparisonHistoryListQuerySchema>;

export const comparisonCreateBodySchema = z.object({
  collegeIds: z.array(z.string().min(1).max(64)).min(2).max(12),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const comparisonPreviewQuerySchema = z.object({
  collegeIds: z.string().min(1).transform((s) => s.split(",").map((id) => id.trim()).filter(Boolean)),
});

export type ComparisonCreateBody = z.infer<typeof comparisonCreateBodySchema>;
export type ComparisonPreviewQuery = z.infer<typeof comparisonPreviewQuerySchema>;

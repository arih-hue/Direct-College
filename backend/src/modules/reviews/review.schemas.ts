import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const reviewListQuerySchema = paginationQuerySchema.extend({
  collegeId: z.string().min(1).max(64).optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  verifiedOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sortBy: z.enum(["createdAt", "rating"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;

export const reviewCreateBodySchema = z.object({
  collegeId: z.string().min(1).max(64),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(160).optional(),
  body: z.string().min(10).max(8000),
});

export type ReviewCreateBody = z.infer<typeof reviewCreateBodySchema>;

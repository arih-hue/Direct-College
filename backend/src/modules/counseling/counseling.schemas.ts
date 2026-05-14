import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const counselingListQuerySchema = paginationQuerySchema.extend({
  audience: z.string().max(80).optional(),
  search: z.string().max(160).optional(),
  sortBy: z.enum(["sortOrder", "createdAt", "title"]).default("sortOrder"),
  sortOrder: sortOrderSchema,
});

export type CounselingListQuery = z.infer<typeof counselingListQuerySchema>;

export const counselingSlugParamSchema = z.object({
  slug: z.string().min(1).max(200),
});

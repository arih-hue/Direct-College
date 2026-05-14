import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const collegeListQuerySchema = paginationQuerySchema.extend({
  sortBy: z.enum(["name", "createdAt"]).default("name"),
  sortOrder: sortOrderSchema,
  state: z.string().max(80).optional(),
  city: z.string().max(120).optional(),
  type: z.string().max(80).optional(),
  search: z.string().max(160).optional(),
});

export type CollegeListQuery = z.infer<typeof collegeListQuerySchema>;

export const collegeIdentifierParamSchema = z.object({
  identifier: z.string().min(1).max(200),
});

import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const branchListQuerySchema = paginationQuerySchema.extend({
  collegeId: z.string().min(1).max(64),
  sortBy: z.enum(["name", "createdAt"]).default("name"),
  sortOrder: sortOrderSchema,
  search: z.string().max(160).optional(),
});

export type BranchListQuery = z.infer<typeof branchListQuerySchema>;

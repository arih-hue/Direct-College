import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const cutoffListQuerySchema = paginationQuerySchema
  .extend({
    collegeId: z.string().min(1).max(64).optional(),
    branchId: z.string().min(1).max(64).optional(),
    year: z.coerce.number().int().min(1990).max(2100).optional(),
    exam: z.string().max(80).optional(),
    category: z.string().max(40).optional(),
    sortBy: z.enum(["year", "closingRank", "createdAt"]).default("year"),
    sortOrder: sortOrderSchema,
  })
  .refine((q) => Boolean(q.collegeId || q.branchId || q.year), {
    message: "Provide at least one of collegeId, branchId, or year",
    path: ["collegeId"],
  });

export type CutoffListQuery = z.infer<typeof cutoffListQuerySchema>;

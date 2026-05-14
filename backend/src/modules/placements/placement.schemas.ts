import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const placementListQuerySchema = paginationQuerySchema.extend({
  collegeId: z.string().min(1).max(64),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  company: z.string().max(120).optional(),
  sortBy: z.enum(["year", "createdAt", "averagePackage"]).default("year"),
  sortOrder: sortOrderSchema,
});

export type PlacementListQuery = z.infer<typeof placementListQuerySchema>;

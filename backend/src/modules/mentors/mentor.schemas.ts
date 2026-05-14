import { z } from "zod";

import { paginationQuerySchema, sortOrderSchema } from "../../schemas/common.js";

export const mentorListQuerySchema = paginationQuerySchema.extend({
  search: z.string().max(160).optional(),
  sortBy: z.enum(["createdAt", "hourlyRate", "yearsExp"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

export type MentorListQuery = z.infer<typeof mentorListQuerySchema>;

export const mentorIdParamSchema = z.object({
  id: z.string().min(1).max(64),
});

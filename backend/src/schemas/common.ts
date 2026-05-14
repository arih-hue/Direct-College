import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

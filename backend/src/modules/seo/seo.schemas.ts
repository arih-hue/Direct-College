import { z } from "zod";

export const seoSlugBodySchema = z.object({
  name: z.string().min(1).max(200),
});

export const seoDynamicPagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

export type SeoSlugBody = z.infer<typeof seoSlugBodySchema>;
export type SeoDynamicPagesQuery = z.infer<typeof seoDynamicPagesQuerySchema>;

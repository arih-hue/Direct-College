import { z } from "zod";

import { paginationQuerySchema } from "../../schemas/common.js";
import { triggerIngestionBodySchema } from "../ingestion/ingestion.schemas.js";
import { triggerScrapeBodySchema } from "../scraping/scraping.schemas.js";

export { triggerIngestionBodySchema, triggerScrapeBodySchema };

export const adminCollegeCreateBodySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120).optional(),
  state: z.string().max(80).optional(),
  city: z.string().max(120).optional(),
  website: z.string().url().optional().or(z.literal("")),
  type: z.string().max(80).optional(),
});

export const adminCollegeUpdateBodySchema = adminCollegeCreateBodySchema.partial();

export const adminReviewModerateBodySchema = z.object({
  action: z.enum(["approve", "reject", "delete"]),
});

export const adminMentorPatchBodySchema = z.object({
  isActive: z.boolean().optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(4000).optional(),
  hourlyRate: z.coerce.number().positive().optional(),
});

export const adminPendingReviewsQuerySchema = paginationQuerySchema;

export type AdminCollegeCreateBody = z.infer<typeof adminCollegeCreateBodySchema>;
export type AdminCollegeUpdateBody = z.infer<typeof adminCollegeUpdateBodySchema>;
export type AdminReviewModerateBody = z.infer<typeof adminReviewModerateBodySchema>;
export type AdminMentorPatchBody = z.infer<typeof adminMentorPatchBodySchema>;
export type AdminPendingReviewsQuery = z.infer<typeof adminPendingReviewsQuerySchema>;
export type TriggerScrapeBody = z.infer<typeof triggerScrapeBodySchema>;
export type TriggerIngestionBody = z.infer<typeof triggerIngestionBodySchema>;

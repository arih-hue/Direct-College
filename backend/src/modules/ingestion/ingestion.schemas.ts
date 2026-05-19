import { z } from "zod";

import { paginationQuerySchema } from "../../schemas/common.js";

export const triggerIngestionBodySchema = z.object({
  agency: z.string().min(1).max(80),
  format: z.enum(["CSV", "XLSX", "PDF", "JSON", "XML"]),
  sourceUri: z.string().min(1).max(2048),
  entityType: z.enum(["college", "branch", "cutoff", "placement", "generic"]).optional(),
  commit: z.boolean().optional(),
});

export const govSyncBodySchema = triggerIngestionBodySchema.extend({
  externalId: z.string().max(120).optional(),
  title: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const commitIngestionBodySchema = z.object({
  ingestionJobId: z.string().min(1),
});

export const ingestionJobListQuerySchema = paginationQuerySchema.extend({
  agency: z.string().max(80).optional(),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
});

export const ingestionJobIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type TriggerIngestionBody = z.infer<typeof triggerIngestionBodySchema>;
export type GovSyncBody = z.infer<typeof govSyncBodySchema>;
export type CommitIngestionBody = z.infer<typeof commitIngestionBodySchema>;
export type IngestionJobListQuery = z.infer<typeof ingestionJobListQuerySchema>;

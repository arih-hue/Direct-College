import { z } from "zod";

import { paginationQuerySchema } from "../../schemas/common.js";

export const jeePredictBodySchema = z.object({
  rank: z.coerce.number().int().positive().max(2_000_000),
  category: z.string().min(1).max(40),
  gender: z.string().min(1).max(32),
  state: z.string().min(1).max(80),
  branchPreferences: z.array(z.string().min(1).max(64)).min(1).max(32),
  /** Defaults to latest year present in `Cutoff` */
  year: z.coerce.number().int().min(1990).max(2100).optional(),
});

export type JeePredictBody = z.infer<typeof jeePredictBodySchema>;

export const predictorHistoryQuerySchema = paginationQuerySchema;

export type PredictorHistoryQuery = z.infer<typeof predictorHistoryQuerySchema>;

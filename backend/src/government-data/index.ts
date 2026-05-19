import type { IngestionFileFormat } from "@prisma/client";

import { enqueueIngestionJob } from "../queues/producers.js";

/**
 * Ingestion jobs for public-sector datasets (AICTE, AISHE, state CET cells, etc.).
 */
export type GovSyncParams = {
  agency: string;
  externalId?: string;
  title?: string;
  sourceUri: string;
  format: IngestionFileFormat;
  entityType?: string;
  commit?: boolean;
  metadata?: Record<string, unknown>;
};

export async function syncGovernmentDataset(params: GovSyncParams): Promise<{
  ingestionJobId: string;
  bullJobId: string | undefined;
}> {
  const result = await enqueueIngestionJob({
    agency: params.agency,
    format: params.format,
    sourceUri: params.sourceUri,
    metadata: {
      entityType: params.entityType ?? "generic",
      commit: params.commit ?? false,
      externalId: params.externalId,
      title: params.title,
      ...params.metadata,
    },
  });
  return result;
}

export { fingerprintRecord } from "./dedupe.js";
export { normalizeRow, normalizeRows } from "./normalize.js";
export {
  validateRowShape,
  validateCollegeRow,
  validateBranchRow,
  validateCutoffRow,
  validatePlacementRow,
} from "./validate.js";
export { mapCollegeRow, upsertCollegeRow } from "./mapping/collegeMapping.js";
export { mapBranchRow, resolveCollegeId, upsertBranchForRow } from "./mapping/branchMapping.js";
export { commitCutoffRow } from "./mapping/cutoffMapping.js";

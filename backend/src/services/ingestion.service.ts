import type { IngestionFileFormat } from "@prisma/client";

import { commitStagedRows } from "../ingestion-pipeline/commitStagedRows.js";
import { syncGovernmentDataset } from "../government-data/index.js";
import { enqueueIngestionJob } from "../queues/producers.js";
import { governmentDatasetRepository } from "../repositories/governmentDataset.repository.js";
import { ingestionJobRepository } from "../repositories/ingestionJob.repository.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type {
  CommitIngestionBody,
  GovSyncBody,
  IngestionJobListQuery,
  TriggerIngestionBody,
} from "../modules/ingestion/ingestion.schemas.js";

export const ingestionService = {
  async trigger(body: TriggerIngestionBody) {
    return enqueueIngestionJob({
      agency: body.agency,
      format: body.format as IngestionFileFormat,
      sourceUri: body.sourceUri,
      metadata: {
        entityType: body.entityType ?? "generic",
        commit: body.commit ?? false,
      },
    });
  },

  async syncGov(body: GovSyncBody) {
    return syncGovernmentDataset({
      agency: body.agency,
      sourceUri: body.sourceUri,
      format: body.format as IngestionFileFormat,
      entityType: body.entityType,
      ...(body.commit !== undefined ? { commit: body.commit } : {}),
      ...(body.externalId !== undefined ? { externalId: body.externalId } : {}),
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.metadata !== undefined ? { metadata: body.metadata } : {}),
    });
  },

  async list(query: IngestionJobListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    return ingestionJobRepository.list({
      take: pageSize,
      skip,
      ...(query.agency ? { agency: query.agency } : {}),
      ...(query.status ? { status: query.status } : {}),
    });
  },

  async getById(id: string) {
    const job = await ingestionJobRepository.findById(id);
    if (!job) return null;
    const stagedCount = await ingestionJobRepository.countStagedRows(id);
    return { ...job, stagedCount };
  },

  async commit(body: CommitIngestionBody) {
    const job = await ingestionJobRepository.findById(body.ingestionJobId);
    if (!job) {
      return null;
    }
    const committed = await commitStagedRows(body.ingestionJobId);
    return { ingestionJobId: body.ingestionJobId, committed };
  },

  async listDatasets(query: IngestionJobListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    return governmentDatasetRepository.list(query.agency, pageSize, skip);
  },
};

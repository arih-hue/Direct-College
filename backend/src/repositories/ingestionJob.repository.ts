import type { PipelineJobStatus, Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export const ingestionJobRepository = {
  async findById(id: string) {
    return prisma.ingestionJob.findUnique({ where: { id } });
  },

  async updateStatus(
    id: string,
    patch: {
      status: PipelineJobStatus;
      recordCount?: number | null;
      errorMessage?: string | null;
      startedAt?: Date | null;
      completedAt?: Date | null;
    },
  ) {
    const data: Prisma.IngestionJobUpdateInput = { status: patch.status };
    if (patch.recordCount !== undefined) data.recordCount = patch.recordCount;
    if (patch.errorMessage !== undefined) data.errorMessage = patch.errorMessage;
    if (patch.startedAt !== undefined) data.startedAt = patch.startedAt;
    if (patch.completedAt !== undefined) data.completedAt = patch.completedAt;
    return prisma.ingestionJob.update({ where: { id }, data });
  },

  async bulkCreateStagedRows(
    ingestionJobId: string,
    rows: Array<{
      fingerprint: string;
      entityType: string;
      normalized: Prisma.InputJsonValue;
      validationErrors?: Prisma.InputJsonValue;
      mappedCollegeId?: string | null;
    }>,
  ) {
    if (rows.length === 0) return { count: 0 };
    const result = await prisma.ingestionStagedRow.createMany({
      data: rows.map((r) => ({
        ingestionJobId,
        fingerprint: r.fingerprint,
        entityType: r.entityType,
        normalized: r.normalized,
        validationErrors: r.validationErrors ?? undefined,
        mappedCollegeId: r.mappedCollegeId ?? undefined,
      })),
      skipDuplicates: true,
    });
    return result;
  },
};

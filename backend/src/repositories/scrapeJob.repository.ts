import type { PipelineJobStatus, Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export const scrapeJobRepository = {
  async create(data: Prisma.ScrapeJobCreateInput) {
    return prisma.scrapeJob.create({ data });
  },

  async findById(id: string) {
    return prisma.scrapeJob.findUnique({ where: { id } });
  },

  async updateStatus(
    id: string,
    patch: {
      status: PipelineJobStatus;
      attemptCount?: number;
      errorMessage?: string | null;
      resultPayload?: Prisma.InputJsonValue;
      startedAt?: Date | null;
      completedAt?: Date | null;
      htmlSnapshotUri?: string | null;
    },
  ) {
    const data: Prisma.ScrapeJobUpdateInput = { status: patch.status };
    if (patch.attemptCount !== undefined) data.attemptCount = patch.attemptCount;
    if (patch.errorMessage !== undefined) data.errorMessage = patch.errorMessage;
    if (patch.resultPayload !== undefined) data.resultPayload = patch.resultPayload;
    if (patch.startedAt !== undefined) data.startedAt = patch.startedAt;
    if (patch.completedAt !== undefined) data.completedAt = patch.completedAt;
    if (patch.htmlSnapshotUri !== undefined) data.htmlSnapshotUri = patch.htmlSnapshotUri;
    return prisma.scrapeJob.update({ where: { id }, data });
  },

  async log(id: string, level: string, message: string, metadata?: Prisma.InputJsonValue) {
    return prisma.scrapingLog.create({
      data: {
        scrapeJobId: id,
        level,
        message,
        metadata: metadata ?? undefined,
      },
    });
  },
};

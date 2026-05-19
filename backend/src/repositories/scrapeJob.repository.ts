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

  async list(params: { take: number; skip: number; sourceType?: import("@prisma/client").ScrapeSourceType; status?: import("@prisma/client").PipelineJobStatus }) {
    const where: Prisma.ScrapeJobWhereInput = {};
    if (params.sourceType) where.sourceType = params.sourceType;
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      prisma.scrapeJob.findMany({
        where,
        take: params.take,
        skip: params.skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          sourceType: true,
          targetUrl: true,
          status: true,
          attemptCount: true,
          errorMessage: true,
          htmlSnapshotUri: true,
          bullJobId: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.scrapeJob.count({ where }),
    ]);
    return { items, total };
  },

  async listLogs(scrapeJobId: string, take: number, skip: number) {
    const where = { scrapeJobId };
    const [items, total] = await Promise.all([
      prisma.scrapingLog.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "asc" },
      }),
      prisma.scrapingLog.count({ where }),
    ]);
    return { items, total };
  },
};

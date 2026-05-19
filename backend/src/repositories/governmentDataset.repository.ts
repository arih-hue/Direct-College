import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export const governmentDatasetRepository = {
  async list(agency: string | undefined, take: number, skip: number) {
    const where: Prisma.GovernmentDatasetWhereInput = agency ? { agency } : {};
    const [items, total] = await Promise.all([
      prisma.governmentDataset.findMany({
        where,
        take,
        skip,
        orderBy: { lastSyncedAt: "desc" },
      }),
      prisma.governmentDataset.count({ where }),
    ]);
    return { items, total };
  },

  async findByAgencyExternalId(agency: string, externalId: string) {
    return prisma.governmentDataset.findUnique({
      where: { agency_externalId: { agency, externalId } },
    });
  },
};

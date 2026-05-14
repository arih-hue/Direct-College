import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export const comparisonRepository = {
  async listForUser(userId: string, take: number, skip: number) {
    const where: Prisma.ComparisonHistoryWhereInput = { userId };
    const [items, total] = await Promise.all([
      prisma.comparisonHistory.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.comparisonHistory.count({ where }),
    ]);
    return { items, total };
  },

  async create(data: Prisma.ComparisonHistoryCreateInput) {
    return prisma.comparisonHistory.create({ data });
  },
};

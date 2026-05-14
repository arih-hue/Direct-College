import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type CutoffListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.CutoffWhereInput;
  orderBy: Prisma.CutoffOrderByWithRelationInput;
};

export const cutoffRepository = {
  async list(params: CutoffListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const select = {
      id: true,
      collegeId: true,
      branchId: true,
      year: true,
      exam: true,
      category: true,
      round: true,
      openingRank: true,
      closingRank: true,
      createdAt: true,
    } as const;

    const [items, total] = await Promise.all([
      prisma.cutoff.findMany({ where, take, skip, orderBy, select }),
      prisma.cutoff.count({ where }),
    ]);
    return { items, total };
  },
};

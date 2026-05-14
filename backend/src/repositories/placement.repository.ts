import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type PlacementListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.PlacementWhereInput;
  orderBy: Prisma.PlacementOrderByWithRelationInput;
};

export const placementRepository = {
  async list(params: PlacementListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const select = {
      id: true,
      collegeId: true,
      year: true,
      company: true,
      role: true,
      highestPackage: true,
      averagePackage: true,
      medianPackage: true,
      offers: true,
      createdAt: true,
    } as const;

    const [items, total] = await Promise.all([
      prisma.placement.findMany({ where, take, skip, orderBy, select }),
      prisma.placement.count({ where }),
    ]);
    return { items, total };
  },
};

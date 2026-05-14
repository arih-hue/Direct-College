import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type BranchListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.BranchWhereInput;
  orderBy: Prisma.BranchOrderByWithRelationInput;
};

export const branchRepository = {
  async list(params: BranchListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const select = {
      id: true,
      collegeId: true,
      name: true,
      code: true,
      degree: true,
      createdAt: true,
    } as const;

    const [items, total] = await Promise.all([
      prisma.branch.findMany({ where, take, skip, orderBy, select }),
      prisma.branch.count({ where }),
    ]);
    return { items, total };
  },
};

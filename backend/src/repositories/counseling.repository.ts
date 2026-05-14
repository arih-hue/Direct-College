import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type CounselingListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.CounselingStrategyWhereInput;
  orderBy: Prisma.CounselingStrategyOrderByWithRelationInput;
};

export const counselingRepository = {
  async list(params: CounselingListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const select = {
      id: true,
      slug: true,
      title: true,
      summary: true,
      audience: true,
      published: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    const [items, total] = await Promise.all([
      prisma.counselingStrategy.findMany({ where, take, skip, orderBy, select }),
      prisma.counselingStrategy.count({ where }),
    ]);
    return { items, total };
  },

  async findBySlug(slug: string) {
    return prisma.counselingStrategy.findFirst({
      where: { slug, published: true },
    });
  },
};

import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type CollegeListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.CollegeWhereInput;
  orderBy: Prisma.CollegeOrderByWithRelationInput;
};

export const collegeRepository = {
  async list(params: CollegeListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const select = {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      country: true,
      type: true,
      createdAt: true,
    } as const;

    const [items, total] = await Promise.all([
      prisma.college.findMany({
        where,
        take,
        skip,
        orderBy,
        select,
      }),
      prisma.college.count({ where }),
    ]);
    return { items, total };
  },

  async findBySlug(slug: string) {
    return prisma.college.findUnique({ where: { slug } });
  },

  async findById(id: string) {
    return prisma.college.findUnique({ where: { id } });
  },

  async findByIdentifier(identifier: string) {
    const bySlug = await prisma.college.findUnique({ where: { slug: identifier } });
    if (bySlug) return bySlug;
    return prisma.college.findUnique({ where: { id: identifier } });
  },
};

import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type ReviewListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.ReviewWhereInput;
  orderBy: Prisma.ReviewOrderByWithRelationInput;
};

export const reviewRepository = {
  async list(params: ReviewListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take,
        skip,
        orderBy,
        select: {
          id: true,
          collegeId: true,
          rating: true,
          title: true,
          body: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);
    return { items, total };
  },

  async create(data: Prisma.ReviewCreateInput) {
    return prisma.review.create({ data });
  },

  async findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } }, college: { select: { id: true, name: true } } },
    });
  },

  async update(id: string, data: Prisma.ReviewUpdateInput) {
    return prisma.review.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  async listPending(take: number, skip: number) {
    const where: Prisma.ReviewWhereInput = { isVerified: false };
    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } }, college: { select: { id: true, name: true } } },
      }),
      prisma.review.count({ where }),
    ]);
    return { items, total };
  },
};

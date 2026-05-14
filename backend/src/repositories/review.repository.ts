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
};

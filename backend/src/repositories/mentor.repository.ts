import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type MentorListRepoParams = {
  take: number;
  skip: number;
  where: Prisma.MentorProfileWhereInput;
  orderBy: Prisma.MentorProfileOrderByWithRelationInput;
};

export const mentorRepository = {
  async list(params: MentorListRepoParams) {
    const { take, skip, where, orderBy } = params;
    const [items, total] = await Promise.all([
      prisma.mentorProfile.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.mentorProfile.count({ where }),
    ]);
    return { items, total };
  },

  async findById(id: string) {
    return prisma.mentorProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  },

  async update(id: string, data: Prisma.MentorProfileUpdateInput) {
    return prisma.mentorProfile.update({ where: { id }, data });
  },
};

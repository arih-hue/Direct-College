import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export const predictionRepository = {
  async create(data: Prisma.AIPredictionCreateInput) {
    return prisma.aIPrediction.create({ data });
  },

  async listForUser(userId: string, take: number, skip: number) {
    const where: Prisma.AIPredictionWhereInput = { userId };
    const [items, total] = await Promise.all([
      prisma.aIPrediction.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          collegeId: true,
          modelName: true,
          modelVersion: true,
          input: true,
          output: true,
          confidence: true,
          createdAt: true,
        },
      }),
      prisma.aIPrediction.count({ where }),
    ]);
    return { items, total };
  },
};

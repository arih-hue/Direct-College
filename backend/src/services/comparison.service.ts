import { prisma } from "../config/database.js";
import { getOrSet, stableCacheKey } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import { comparisonRepository } from "../repositories/comparison.repository.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import { AppError } from "../utils/errors.js";
import type { ComparisonCreateBody, ComparisonHistoryListQuery } from "../modules/comparisons/comparison.schemas.js";
import type { Prisma } from "@prisma/client";

export const comparisonService = {
  async listMine(userId: string, query: ComparisonHistoryListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    return comparisonRepository.listForUser(userId, pageSize, skip);
  },

  async create(userId: string | undefined, body: ComparisonCreateBody) {
    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "Sign in to save comparison history.");
    }
    return comparisonRepository.create({
      collegeIds: body.collegeIds,
      user: { connect: { id: userId } },
      ...(body.metadata !== undefined
        ? { metadata: body.metadata as unknown as Prisma.InputJsonValue }
        : {}),
    });
  },

  async preview(collegeIds: string[]) {
    const sorted = [...collegeIds].sort();
    const key = cacheKey(CacheNS.comparison, "preview", stableCacheKey({ ids: sorted }));
    const { data } = await getOrSet(key, CacheTTL.COMPARISON, async () => {
      const colleges = await prisma.college.findMany({
        where: { id: { in: sorted } },
        select: {
          id: true,
          name: true,
          slug: true,
          state: true,
          city: true,
          type: true,
          branches: { select: { id: true, name: true, code: true }, take: 20 },
          placements: {
            select: { year: true, averagePackage: true, highestPackage: true },
            orderBy: { year: "desc" },
            take: 3,
          },
          _count: { select: { reviews: true } },
        },
      });
      return { colleges, requested: sorted.length, found: colleges.length };
    });
    return data;
  },
};

import type { Prisma } from "@prisma/client";

import { cutoffRepository } from "../repositories/cutoff.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { CutoffListQuery } from "../modules/cutoffs/cutoff.schemas.js";

function buildWhere(query: CutoffListQuery): Prisma.CutoffWhereInput {
  const where: Prisma.CutoffWhereInput = {};
  if (query.collegeId) where.collegeId = query.collegeId;
  if (query.branchId) where.branchId = query.branchId;
  if (query.year) where.year = query.year;
  if (query.exam) where.exam = { equals: query.exam, mode: "insensitive" };
  if (query.category) where.category = { equals: query.category, mode: "insensitive" };
  return where;
}

function buildOrderBy(query: CutoffListQuery): Prisma.CutoffOrderByWithRelationInput {
  if (query.sortBy === "closingRank") {
    return { closingRank: query.sortOrder };
  }
  if (query.sortBy === "createdAt") {
    return { createdAt: query.sortOrder };
  }
  return { year: query.sortOrder };
}

export const cutoffService = {
  async list(query: CutoffListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `cutoffs:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof cutoffRepository.list>>;
    }

    const result = await cutoffRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 30);
    return result;
  },
};

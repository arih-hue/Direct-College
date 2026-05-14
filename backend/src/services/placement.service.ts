import type { Prisma } from "@prisma/client";

import { placementRepository } from "../repositories/placement.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { PlacementListQuery } from "../modules/placements/placement.schemas.js";

function buildWhere(query: PlacementListQuery): Prisma.PlacementWhereInput {
  const where: Prisma.PlacementWhereInput = { collegeId: query.collegeId };
  if (query.year) where.year = query.year;
  if (query.company) {
    where.company = { contains: query.company, mode: "insensitive" };
  }
  return where;
}

function buildOrderBy(query: PlacementListQuery): Prisma.PlacementOrderByWithRelationInput {
  if (query.sortBy === "createdAt") {
    return { createdAt: query.sortOrder };
  }
  if (query.sortBy === "averagePackage") {
    return { averagePackage: query.sortOrder };
  }
  return { year: query.sortOrder };
}

export const placementService = {
  async list(query: PlacementListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `placements:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof placementRepository.list>>;
    }

    const result = await placementRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 30);
    return result;
  },
};

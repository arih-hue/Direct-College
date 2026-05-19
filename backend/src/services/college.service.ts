import type { Prisma } from "@prisma/client";

import { collegeRepository } from "../repositories/college.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { CollegeListQuery } from "../modules/colleges/college.schemas.js";

const LIST_TTL_SECONDS = CacheTTL.COLLEGE_LIST;

function buildWhere(query: CollegeListQuery): Prisma.CollegeWhereInput {
  const where: Prisma.CollegeWhereInput = {};
  if (query.state) {
    where.state = { equals: query.state, mode: "insensitive" };
  }
  if (query.city) {
    where.city = { contains: query.city, mode: "insensitive" };
  }
  if (query.type) {
    where.type = { equals: query.type, mode: "insensitive" };
  }
  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }
  return where;
}

function buildOrderBy(query: CollegeListQuery): Prisma.CollegeOrderByWithRelationInput {
  if (query.sortBy === "createdAt") {
    return { createdAt: query.sortOrder };
  }
  return { name: query.sortOrder };
}

export const collegeService = {
  async list(query: CollegeListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKeyStr = cacheKey(CacheNS.college, "list", stableCacheKey({ ...query, pageSize, page: query.page }));
    const cached = await appCache.get(cacheKeyStr);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof collegeRepository.list>>;
    }

    const result = await collegeRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKeyStr, JSON.stringify(result), LIST_TTL_SECONDS);
    return result;
  },

  async getByIdentifier(identifier: string) {
    const cacheKeyStr = cacheKey(CacheNS.college, "one", identifier);
    const cached = await appCache.get(cacheKeyStr);
    if (cached) {
      return JSON.parse(cached) as NonNullable<Awaited<ReturnType<typeof collegeRepository.findByIdentifier>>>;
    }
    const row = await collegeRepository.findByIdentifier(identifier);
    if (row) {
      await appCache.set(cacheKeyStr, JSON.stringify(row), CacheTTL.COLLEGE_DETAIL);
    }
    return row;
  },
};

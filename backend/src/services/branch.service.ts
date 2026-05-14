import type { Prisma } from "@prisma/client";

import { branchRepository } from "../repositories/branch.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { BranchListQuery } from "../modules/branches/branch.schemas.js";

function buildWhere(query: BranchListQuery): Prisma.BranchWhereInput {
  const where: Prisma.BranchWhereInput = { collegeId: query.collegeId };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { code: { contains: query.search, mode: "insensitive" } },
      { degree: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(query: BranchListQuery): Prisma.BranchOrderByWithRelationInput {
  if (query.sortBy === "createdAt") {
    return { createdAt: query.sortOrder };
  }
  return { name: query.sortOrder };
}

export const branchService = {
  async list(query: BranchListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `branches:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof branchRepository.list>>;
    }

    const result = await branchRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 20);
    return result;
  },
};

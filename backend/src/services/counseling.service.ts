import type { Prisma } from "@prisma/client";

import { counselingRepository } from "../repositories/counseling.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { CounselingListQuery } from "../modules/counseling/counseling.schemas.js";

function buildWhere(query: CounselingListQuery): Prisma.CounselingStrategyWhereInput {
  const where: Prisma.CounselingStrategyWhereInput = { published: true };
  if (query.audience) {
    where.audience = { equals: query.audience, mode: "insensitive" };
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { summary: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(query: CounselingListQuery): Prisma.CounselingStrategyOrderByWithRelationInput {
  if (query.sortBy === "createdAt") {
    return { createdAt: query.sortOrder };
  }
  if (query.sortBy === "title") {
    return { title: query.sortOrder };
  }
  return { sortOrder: query.sortOrder };
}

export const counselingService = {
  async list(query: CounselingListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `counseling:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof counselingRepository.list>>;
    }

    const result = await counselingRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 60);
    return result;
  },

  async getBySlug(slug: string) {
    const cacheKey = `counseling:slug:${slug}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as NonNullable<Awaited<ReturnType<typeof counselingRepository.findBySlug>>>;
    }
    const row = await counselingRepository.findBySlug(slug);
    if (row) {
      await appCache.set(cacheKey, JSON.stringify(row), 120);
    }
    return row;
  },
};

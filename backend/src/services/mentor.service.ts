import type { Prisma } from "@prisma/client";

import { mentorRepository } from "../repositories/mentor.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { MentorListQuery } from "../modules/mentors/mentor.schemas.js";

function buildWhere(query: MentorListQuery): Prisma.MentorProfileWhereInput {
  const where: Prisma.MentorProfileWhereInput = { isActive: true };
  if (query.search) {
    where.OR = [
      { headline: { contains: query.search, mode: "insensitive" } },
      { bio: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(query: MentorListQuery): Prisma.MentorProfileOrderByWithRelationInput {
  if (query.sortBy === "hourlyRate") {
    return { hourlyRate: query.sortOrder };
  }
  if (query.sortBy === "yearsExp") {
    return { yearsExp: query.sortOrder };
  }
  return { createdAt: query.sortOrder };
}

export const mentorService = {
  async list(query: MentorListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `mentors:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof mentorRepository.list>>;
    }

    const result = await mentorRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 20);
    return result;
  },

  async getById(id: string) {
    const cacheKey = `mentors:one:${id}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as NonNullable<Awaited<ReturnType<typeof mentorRepository.findById>>>;
    }
    const row = await mentorRepository.findById(id);
    if (row) {
      await appCache.set(cacheKey, JSON.stringify(row), 30);
    }
    return row;
  },
};

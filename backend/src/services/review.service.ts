import type { Prisma } from "@prisma/client";

import { reviewRepository } from "../repositories/review.repository.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type { ReviewCreateBody, ReviewListQuery } from "../modules/reviews/review.schemas.js";

function buildWhere(query: ReviewListQuery): Prisma.ReviewWhereInput {
  const where: Prisma.ReviewWhereInput = {};
  if (query.collegeId) where.collegeId = query.collegeId;
  if (query.minRating !== undefined) {
    where.rating = { gte: query.minRating };
  }
  if (query.verifiedOnly === true) {
    where.isVerified = true;
  }
  return where;
}

function buildOrderBy(query: ReviewListQuery): Prisma.ReviewOrderByWithRelationInput {
  if (query.sortBy === "rating") {
    return { rating: query.sortOrder };
  }
  return { createdAt: query.sortOrder };
}

export const reviewService = {
  async list(query: ReviewListQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query);

    const cacheKey = `reviews:list:${stableCacheKey(query)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Awaited<ReturnType<typeof reviewRepository.list>>;
    }

    const result = await reviewRepository.list({ take: pageSize, skip, where, orderBy });
    await appCache.set(cacheKey, JSON.stringify(result), 15);
    return result;
  },

  async create(userId: string, body: ReviewCreateBody) {
    return reviewRepository.create({
      rating: body.rating,
      body: body.body,
      user: { connect: { id: userId } },
      college: { connect: { id: body.collegeId } },
      ...(body.title !== undefined ? { title: body.title } : {}),
    });
  },
};

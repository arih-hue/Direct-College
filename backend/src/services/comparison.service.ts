import type { Prisma } from "@prisma/client";

import { comparisonRepository } from "../repositories/comparison.repository.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import { AppError } from "../utils/errors.js";
import type { ComparisonCreateBody, ComparisonHistoryListQuery } from "../modules/comparisons/comparison.schemas.js";

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
};

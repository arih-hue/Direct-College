import { prisma } from "../config/database.js";
import { appCache } from "../config/cache.js";
import { CacheNS } from "../config/cacheKeys.js";
import { collegeRepository } from "../repositories/college.repository.js";
import { reviewRepository } from "../repositories/review.repository.js";
import { mentorRepository } from "../repositories/mentor.repository.js";
import { analyticsService } from "./analytics.service.js";
import { ingestionService } from "./ingestion.service.js";
import { scrapingService } from "./scraping.service.js";
import { slugify } from "../utils/slugify.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";
import type {
  AdminCollegeCreateBody,
  AdminCollegeUpdateBody,
  AdminMentorPatchBody,
  AdminReviewModerateBody,
} from "../modules/admin/admin.schemas.js";
import type { TriggerIngestionBody, TriggerScrapeBody } from "../modules/admin/admin.schemas.js";

async function invalidateCollegeCache(): Promise<void> {
  await appCache.delByPrefix(`${CacheNS.college}:`);
}

export const adminService = {
  async dashboard() {
    const [colleges, reviews, mentors, users, scrapePending, ingestionPending, predictions] =
      await Promise.all([
        prisma.college.count(),
        prisma.review.count(),
        prisma.mentorProfile.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.scrapeJob.count({ where: { status: { in: ["PENDING", "RUNNING"] } } }),
        prisma.ingestionJob.count({ where: { status: { in: ["PENDING", "RUNNING"] } } }),
        prisma.aIPrediction.count(),
      ]);
    const engagement = await analyticsService.engagementMetrics(7);
    return {
      counts: { colleges, reviews, mentors, users, predictions, scrapePending, ingestionPending },
      engagement,
    };
  },

  async createCollege(body: AdminCollegeCreateBody) {
    const slug = body.slug?.trim() || slugify(body.name);
    const row = await collegeRepository.create({
      name: body.name,
      slug,
      state: body.state ?? null,
      city: body.city ?? null,
      website: body.website ?? null,
      type: body.type ?? null,
    });
    await invalidateCollegeCache();
    return row;
  },

  async updateCollege(id: string, body: AdminCollegeUpdateBody) {
    const row = await collegeRepository.update(id, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.state !== undefined ? { state: body.state } : {}),
      ...(body.city !== undefined ? { city: body.city } : {}),
      ...(body.website !== undefined ? { website: body.website } : {}),
      ...(body.type !== undefined ? { type: body.type } : {}),
    });
    await invalidateCollegeCache();
    return row;
  },

  async deleteCollege(id: string) {
    await collegeRepository.delete(id);
    await invalidateCollegeCache();
    return { deleted: true };
  },

  async listPendingReviews(page: number, pageSize: number) {
    const take = clampPageSize(pageSize, 100);
    const skip = toSkip(page, take);
    return reviewRepository.listPending(take, skip);
  },

  async moderateReview(id: string, body: AdminReviewModerateBody) {
    if (body.action === "delete") {
      await reviewRepository.delete(id);
      await appCache.delByPrefix("reviews:");
      return { deleted: true };
    }
    const row = await reviewRepository.update(id, {
      isVerified: body.action === "approve",
    });
    await appCache.delByPrefix("reviews:");
    return row;
  },

  async updateMentor(id: string, body: AdminMentorPatchBody) {
    const row = await mentorRepository.update(id, {
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.headline !== undefined ? { headline: body.headline } : {}),
      ...(body.bio !== undefined ? { bio: body.bio } : {}),
      ...(body.hourlyRate !== undefined ? { hourlyRate: body.hourlyRate } : {}),
    });
    await appCache.delByPrefix("mentors:");
    return row;
  },

  triggerScrape(body: TriggerScrapeBody) {
    return scrapingService.trigger(body);
  },

  triggerIngestion(body: TriggerIngestionBody) {
    return ingestionService.trigger(body);
  },

  async aiMonitoring() {
    const [predictions, models, mlCacheHits] = await Promise.all([
      analyticsService.predictionAnalytics(30),
      prisma.aIPrediction.groupBy({
        by: ["modelName", "modelVersion"],
        _count: { _all: true },
        orderBy: { _count: { modelName: "desc" } },
        take: 10,
      }),
      appCache.hgetall(`${CacheNS.ai}:stats`),
    ]);
    return {
      predictions,
      models: models.map((m) => ({
        model: m.modelName,
        version: m.modelVersion,
        count: m._count._all,
      })),
      cacheStats: mlCacheHits ?? {},
    };
  },
};

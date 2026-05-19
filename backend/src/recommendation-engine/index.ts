/**
 * Future: collaborative filtering, similarity graphs, cold-start handling.
 * Uses `mlGatewayRequest` when a Python recommendation service is deployed.
 */
import { prisma } from "../config/database.js";

export type RecommendationContext = {
  userId?: string;
  collegeIds?: string[];
  limit?: number;
};

export async function recommendPlaceholder(ctx: RecommendationContext): Promise<{
  items: Array<{ collegeId: string; score: number; reason: string }>;
}> {
  const limit = Math.min(50, Math.max(1, ctx.limit ?? 10));

  if (ctx.collegeIds?.length) {
    const rows = await prisma.college.findMany({
      where: { id: { in: ctx.collegeIds.slice(0, 50) } },
      take: limit,
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return {
      items: rows.map((r, i) => ({
        collegeId: r.id,
        score: Math.max(0.05, 1 - i * 0.03),
        reason: "In-request college list (placeholder heuristic until embeddings ship).",
      })),
    };
  }

  const rows = await prisma.college.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  return {
    items: rows.map((r, i) => ({
      collegeId: r.id,
      score: Math.max(0.05, 0.9 - i * 0.05),
      reason: "Recently updated directory colleges (stub — replace with model scores).",
    })),
  };
}

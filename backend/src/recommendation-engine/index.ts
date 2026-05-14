/**
 * Future: collaborative filtering, similarity graphs, cold-start handling.
 * Call `mlGateway` when Python recommendation service is deployed.
 */
export type RecommendationContext = {
  userId?: string;
  collegeIds?: string[];
  limit?: number;
};

export function recommendPlaceholder(_ctx: RecommendationContext): Promise<{
  items: Array<{ collegeId: string; score: number; reason: string }>;
}> {
  return Promise.resolve({ items: [] });
}

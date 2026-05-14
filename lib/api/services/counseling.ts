import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type CounselingStrategyListItem = Record<string, unknown>;

export async function listCounselingStrategies(params: Record<string, string | number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/counseling-strategies", { params });
  return unwrapData<PaginatedData<CounselingStrategyListItem>>(res.data);
}

export async function getCounselingStrategy(slug: string) {
  const res = await apiClient.get<unknown>(`/counseling-strategies/${encodeURIComponent(slug)}`);
  return unwrapData<CounselingStrategyListItem>(res.data);
}

import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type ComparisonHistoryItem = Record<string, unknown>;

export async function listComparisonHistory(params: Record<string, number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/comparisons/history", { params });
  return unwrapData<PaginatedData<ComparisonHistoryItem>>(res.data);
}

export async function saveComparison(payload: { collegeIds: string[]; metadata?: Record<string, unknown> }) {
  const res = await apiClient.post<unknown>("/comparisons/history", payload);
  return unwrapData<ComparisonHistoryItem>(res.data);
}

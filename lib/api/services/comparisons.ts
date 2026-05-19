import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export async function listComparisonHistory(params: Record<string, number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/comparisons/history", { params });
  return unwrapData<PaginatedData<Record<string, unknown>>>(res.data);
}

export async function saveComparison(payload: {
  collegeIds: string[];
  metadata?: Record<string, unknown>;
}) {
  const res = await apiClient.post<unknown>("/comparisons/history", payload);
  return unwrapData<Record<string, unknown>>(res.data);
}

export async function getComparisonPreview(collegeIds: string[]) {
  const res = await apiClient.get<unknown>("/comparisons/preview", {
    params: { collegeIds: collegeIds.join(",") },
  });
  return unwrapData<unknown>(res.data);
}

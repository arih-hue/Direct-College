import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export async function trackAnalyticsEvent(payload: { name: string; properties?: Record<string, unknown> }) {
  const res = await apiClient.post<unknown>("/analytics/events", payload);
  return unwrapData<{ ok: boolean }>(res.data);
}

export async function getAnalyticsSummary(params: { days?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/summary", { params });
  return unwrapData<{ days: number; buckets: Array<{ date: string; counts: Record<string, string> }> }>(
    res.data,
  );
}

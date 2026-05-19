import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export async function trackAnalyticsEvent(payload: { name: string; properties?: Record<string, unknown> }) {
  const res = await apiClient.post<unknown>("/analytics/events", payload);
  return unwrapData<{ ok: boolean }>(res.data);
}

export async function getAnalyticsSummary(params: { days?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/summary", { params });
  return unwrapData<{ days: number; buckets: Array<{ date: string; counts: Record<string, string> }> }>(res.data);
}

export async function getPopularColleges(params: { limit?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/popular-colleges", { params });
  return unwrapData<{ items: unknown[] }>(res.data);
}

export async function getPredictionAnalytics(params: { days?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/predictions", { params });
  return unwrapData<unknown>(res.data);
}

export async function getEngagementMetrics(params: { days?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/engagement", { params });
  return unwrapData<unknown>(res.data);
}

export async function getComparisonTrends(params: { limit?: number } = {}) {
  const res = await apiClient.get<unknown>("/analytics/comparisons/trends", { params });
  return unwrapData<{ items: Array<{ pair: string; count: number }> }>(res.data);
}

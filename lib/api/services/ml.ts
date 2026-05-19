import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export async function mlPredict(payload: Record<string, unknown> = {}) {
  const res = await apiClient.post<unknown>("/ml/predict", payload);
  return unwrapData<{ source: string; data: unknown }>(res.data);
}

export async function mlRecommend(payload: {
  userId?: string;
  collegeIds?: string[];
  limit?: number;
}) {
  const res = await apiClient.post<unknown>("/ml/recommend", payload);
  return unwrapData<{ source: string; data: unknown }>(res.data);
}

export async function mlAnalyze(payload: {
  event: string;
  payload?: Record<string, unknown>;
  async?: boolean;
  jobKind?: "predict" | "embed" | "batch";
}) {
  const res = await apiClient.post<unknown>("/ml/analyze", payload);
  return unwrapData<{ source: string; data: unknown }>(res.data);
}

export async function mlStrategy(payload: {
  rank: number;
  category: string;
  preferences?: string[];
}) {
  const res = await apiClient.post<unknown>("/ml/strategy", payload);
  return unwrapData<{ source: string; data: unknown }>(res.data);
}

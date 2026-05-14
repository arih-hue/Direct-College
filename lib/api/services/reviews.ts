import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type ReviewListItem = Record<string, unknown>;

export async function listReviews(params: Record<string, string | number | boolean | undefined>) {
  const res = await apiClient.get<unknown>("/reviews", { params });
  return unwrapData<PaginatedData<ReviewListItem>>(res.data);
}

export async function createReview(payload: {
  collegeId: string;
  rating: number;
  title?: string;
  body: string;
}) {
  const res = await apiClient.post<unknown>("/reviews", payload);
  return unwrapData<ReviewListItem>(res.data);
}

import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type MentorListItem = Record<string, unknown>;

export async function listMentors(params: Record<string, string | number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/mentors", { params });
  return unwrapData<PaginatedData<MentorListItem>>(res.data);
}

export async function getMentor(id: string) {
  const res = await apiClient.get<unknown>(`/mentors/${encodeURIComponent(id)}`);
  return unwrapData<MentorListItem>(res.data);
}

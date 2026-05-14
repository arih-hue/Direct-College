import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type PlacementListItem = Record<string, unknown>;

export async function listPlacements(params: Record<string, string | number | undefined>) {
  const res = await apiClient.get<unknown>("/placements", { params });
  return unwrapData<PaginatedData<PlacementListItem>>(res.data);
}

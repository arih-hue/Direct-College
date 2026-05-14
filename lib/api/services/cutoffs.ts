import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type CutoffListItem = Record<string, unknown>;

export async function listCutoffs(params: Record<string, string | number | undefined>) {
  const res = await apiClient.get<unknown>("/cutoffs", { params });
  return unwrapData<PaginatedData<CutoffListItem>>(res.data);
}

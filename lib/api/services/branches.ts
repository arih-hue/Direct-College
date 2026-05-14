import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type BranchListItem = {
  id: string;
  collegeId: string;
  name: string;
  code: string | null;
  degree: string | null;
  createdAt?: string;
};

export type BranchListParams = Record<string, string | number | undefined>;

export async function listBranches(params: BranchListParams) {
  const res = await apiClient.get<unknown>("/branches", { params });
  return unwrapData<PaginatedData<BranchListItem>>(res.data);
}

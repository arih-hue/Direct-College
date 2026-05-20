import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type CollegeListItem = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  country: string;
  type: string | null;
  createdAt?: string;
};

export type CollegeListParams = Record<string, string | number | boolean | undefined>;

export async function listColleges(params: CollegeListParams = {}) {
  const res = await apiClient.get<unknown>("/colleges", { params });
  return unwrapData<PaginatedData<CollegeListItem>>(res.data);
}

export async function getCollege(identifier: string) {
  const res = await apiClient.get<unknown>(`/colleges/${encodeURIComponent(identifier)}`);
  return unwrapData<CollegeListItem & Record<string, unknown>>(res.data);
}
import { supabase } from '@/lib/supabase'

export async function getColleges() {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')

  if (error) {
    console.error(error)
    return []
  }

  return data
}
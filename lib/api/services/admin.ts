import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export async function getAdminDashboard() {
  const res = await apiClient.get<unknown>("/admin/dashboard");
  return unwrapData<unknown>(res.data);
}

export async function createCollege(payload: Record<string, unknown>) {
  const res = await apiClient.post<unknown>("/admin/colleges", payload);
  return unwrapData<unknown>(res.data);
}

export async function updateCollege(id: string, payload: Record<string, unknown>) {
  const res = await apiClient.patch<unknown>(`/admin/colleges/${id}`, payload);
  return unwrapData<unknown>(res.data);
}

export async function deleteCollege(id: string) {
  const res = await apiClient.delete<unknown>(`/admin/colleges/${id}`);
  return unwrapData<unknown>(res.data);
}

export async function listPendingReviews(params: Record<string, number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/admin/reviews/pending", { params });
  return unwrapData<unknown>(res.data);
}

export async function moderateReview(id: string, action: "approve" | "reject" | "delete") {
  const res = await apiClient.post<unknown>(`/admin/reviews/${id}/moderate`, { action });
  return unwrapData<unknown>(res.data);
}

export async function updateMentor(id: string, payload: Record<string, unknown>) {
  const res = await apiClient.patch<unknown>(`/admin/mentors/${id}`, payload);
  return unwrapData<unknown>(res.data);
}

export async function adminTriggerScrape(payload: Record<string, unknown>) {
  const res = await apiClient.post<unknown>("/admin/scraping/jobs", payload);
  return unwrapData<unknown>(res.data);
}

export async function adminTriggerIngestion(payload: Record<string, unknown>) {
  const res = await apiClient.post<unknown>("/admin/ingestion/jobs", payload);
  return unwrapData<unknown>(res.data);
}

export async function getAiMonitoring() {
  const res = await apiClient.get<unknown>("/admin/ai/monitoring");
  return unwrapData<unknown>(res.data);
}

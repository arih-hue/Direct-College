import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export type MeResponse = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  avatarUrl: string | null;
};

export async function getMe() {
  const res = await apiClient.get<unknown>("/users/me");
  return unwrapData<MeResponse>(res.data);
}

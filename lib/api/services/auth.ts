import { setAccessToken } from "../../auth/token";
import { apiClient } from "../client";
import { unwrapData } from "../unwrap";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

async function postAuth(path: string, body: unknown): Promise<AuthSession> {
  const res = await apiClient.post<unknown>(path, body);
  const session = unwrapData<AuthSession>(res.data);
  setAccessToken(session.accessToken);
  return session;
}

export async function register(payload: { email: string; password: string; name?: string }) {
  return postAuth("/auth/register", payload);
}

export async function login(payload: { email: string; password: string }) {
  return postAuth("/auth/login", payload);
}

export async function googleSignIn(payload: { idToken: string }) {
  return postAuth("/auth/google", payload);
}

export async function refreshSession() {
  const res = await apiClient.post<unknown>("/auth/refresh");
  const session = unwrapData<AuthSession>(res.data);
  setAccessToken(session.accessToken);
  return session;
}

export async function logout() {
  await apiClient.post("/auth/logout");
  setAccessToken(null);
}

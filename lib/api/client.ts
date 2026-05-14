import axios from "axios";

import { clearSession, getAccessToken } from "../auth/token";
import { publicEnv } from "../env.public";
import { ApiRequestError, normalizeAxiosError } from "./errors";

export const apiClient = axios.create({
  baseURL: publicEnv.apiBaseUrl,
  withCredentials: true,
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalized = normalizeAxiosError(error);
    if (normalized instanceof ApiRequestError && normalized.status === 401) {
      clearSession();
    }
    return Promise.reject(normalized);
  },
);

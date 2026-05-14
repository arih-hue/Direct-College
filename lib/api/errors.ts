import type { AxiosError } from "axios";

import type { ApiErrorEnvelope } from "./types";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ApiErrorEnvelope>;
  return v.success === false && typeof v.error?.code === "string" && typeof v.error?.message === "string";
}

export function normalizeAxiosError(error: unknown): unknown {
  if (!(error && typeof error === "object" && "isAxiosError" in error)) {
    return error;
  }

  const axiosError = error as AxiosError<unknown>;
  const status = axiosError.response?.status ?? 0;
  const body = axiosError.response?.data;

  if (isApiErrorEnvelope(body)) {
    return new ApiRequestError(status, body.error.code, body.error.message, body.error.details);
  }

  const message =
    typeof body === "object" && body && "message" in body && typeof (body as { message?: unknown }).message === "string"
      ? String((body as { message: string }).message)
      : axiosError.message || "Request failed";

  return new ApiRequestError(status || 500, "HTTP_ERROR", message, body);
}

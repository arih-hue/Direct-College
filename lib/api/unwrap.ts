import type { ApiSuccessEnvelope } from "./types";

export function unwrapData<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid API response");
  }
  const envelope = payload as Partial<ApiSuccessEnvelope<T>>;
  if (envelope.success !== true) {
    throw new Error("Expected a successful API envelope");
  }
  return envelope.data as T;
}

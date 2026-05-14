import { env } from "../config/env.js";

export type MlGatewayRequest = {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export type MlGatewayResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data: T;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * HTTP gateway for future Python FastAPI (or external AI) services.
 * Retries on 429 / 5xx with exponential backoff. Returns `null` when `ML_SERVICE_URL` is unset.
 */
export async function mlGatewayPost<T = unknown>(req: MlGatewayRequest): Promise<MlGatewayResponse<T> | null> {
  if (!env.ML_SERVICE_URL) {
    return null;
  }

  const base = env.ML_SERVICE_URL.replace(/\/+$/, "");
  const path = req.path.startsWith("/") ? req.path : `/${req.path}`;
  const url = `${base}${path}`;
  const maxRetries = env.ML_SERVICE_MAX_RETRIES;
  const timeoutMs = env.ML_SERVICE_TIMEOUT_MS;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const init: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.ML_SERVICE_API_KEY ? { Authorization: `Bearer ${env.ML_SERVICE_API_KEY}` } : {}),
          ...req.headers,
        },
        signal: controller.signal,
      };
      if (req.body !== undefined) {
        init.body = JSON.stringify(req.body);
      }
      const res = await fetch(url, init);

      clearTimeout(timer);

      const text = await res.text();
      let data: unknown = text;
      try {
        data = text ? (JSON.parse(text) as unknown) : null;
      } catch {
        data = text;
      }

      if (res.ok) {
        return { ok: true, status: res.status, data: data as T };
      }

      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt === maxRetries) {
        return { ok: false, status: res.status, data: data as T };
      }
    } catch {
      clearTimeout(timer);
      if (attempt === maxRetries) {
        throw new Error("ML gateway request failed after retries");
      }
    }

    const backoff = Math.min(2000, 250 * 2 ** attempt);
    await sleep(backoff);
  }

  return null;
}

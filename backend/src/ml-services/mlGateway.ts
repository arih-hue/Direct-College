import { env } from "../config/env.js";

export type MlGatewayHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type MlGatewayRequestOptions = {
  method: MlGatewayHttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

/** @deprecated Prefer `MlGatewayRequestOptions` + `mlGatewayRequest`. */
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

function buildUrl(path: string): string | null {
  if (!env.ML_SERVICE_URL) {
    return null;
  }
  const base = env.ML_SERVICE_URL.replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * HTTP gateway for Python FastAPI or external AI vendors.
 * Retries on 429 / 5xx (and network errors) with exponential backoff.
 * Returns `null` when `ML_SERVICE_URL` is unset.
 */
export async function mlGatewayRequest<T = unknown>(
  req: MlGatewayRequestOptions,
): Promise<MlGatewayResponse<T> | null> {
  const url = buildUrl(req.path);
  if (!url) {
    return null;
  }

  const maxRetries = env.ML_SERVICE_MAX_RETRIES;
  const timeoutMs = env.ML_SERVICE_TIMEOUT_MS;
  const sendsBody =
    req.body !== undefined && (req.method === "POST" || req.method === "PUT" || req.method === "PATCH");

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const headers: Record<string, string> = {
        ...(env.ML_SERVICE_API_KEY ? { Authorization: `Bearer ${env.ML_SERVICE_API_KEY}` } : {}),
        ...req.headers,
      };
      if (sendsBody) {
        headers["Content-Type"] = "application/json";
      }

      const init: RequestInit = {
        method: req.method,
        headers,
        signal: controller.signal,
      };
      if (sendsBody) {
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

  throw new Error("ML gateway: unreachable retry loop");
}

export async function mlGatewayPost<T = unknown>(req: MlGatewayRequest): Promise<MlGatewayResponse<T> | null> {
  return mlGatewayRequest<T>({ method: "POST", path: req.path, body: req.body, headers: req.headers });
}

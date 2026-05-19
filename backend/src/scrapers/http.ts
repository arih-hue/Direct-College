import { assertUrlAllowedByRobots } from "./robots.js";
import { hostFromUrl, waitForHostRateLimit } from "./rateLimit.js";

export type FetchPolicyOptions = {
  skipRobots?: boolean;
  skipRateLimit?: boolean;
  timeoutMs?: number;
};

/**
 * Static HTTP fetch with robots.txt + per-host rate limiting.
 */
export async function fetchWithPolicy(url: string, options: FetchPolicyOptions = {}): Promise<Response> {
  if (!options.skipRobots) {
    await assertUrlAllowedByRobots(url);
  }
  if (!options.skipRateLimit) {
    await waitForHostRateLimit(hostFromUrl(url));
  }
  const timeoutMs = options.timeoutMs ?? 60_000;
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
}

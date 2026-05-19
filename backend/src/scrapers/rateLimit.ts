const lastRequestAt = new Map<string, number>();

/** Minimum gap between requests to the same host (ms). */
const DEFAULT_MIN_INTERVAL_MS = 1200;

/**
 * Simple per-host throttle for scrapers. Uses in-process state (one worker process).
 */
export async function waitForHostRateLimit(
  host: string,
  minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
): Promise<void> {
  const key = host.toLowerCase();
  const now = Date.now();
  const last = lastRequestAt.get(key) ?? 0;
  const wait = minIntervalMs - (now - last);
  if (wait > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, wait);
    });
  }
  lastRequestAt.set(key, Date.now());
}

export function hostFromUrl(url: string): string {
  return new URL(url).host.toLowerCase();
}

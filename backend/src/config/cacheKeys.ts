/** TTL seconds per cache domain. Tune per environment via overrides later if needed. */
export const CacheTTL = {
  PREDICTOR: 120,
  COLLEGE_DETAIL: 120,
  COLLEGE_LIST: 45,
  ANALYTICS: 60,
  COMPARISON: 300,
  AI: 600,
  SCRAPE_META: 300,
  SEO: 3600,
} as const;

export const CacheNS = {
  predictor: "predictor",
  college: "college",
  analytics: "analytics",
  comparison: "comparison",
  ai: "ai",
  scrape: "scrape",
  seo: "seo",
} as const;

export function cacheKey(ns: string, ...parts: (string | number)[]): string {
  return `${ns}:${parts.join(":")}`;
}

const cache = new Map<string, { expiresAt: number; allowed: boolean }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

function parseRobotsDisallow(body: string, userAgent = "*"): string[] {
  const lines = body.split(/\r?\n/);
  let applies = false;
  const rules: string[] = [];

  for (const raw of lines) {
    const line = raw.split("#")[0]?.trim() ?? "";
    if (!line) continue;
    const [directive, ...rest] = line.split(":").map((s) => s.trim());
    const value = rest.join(":").trim();
    if (!directive || !value) continue;

    const lower = directive.toLowerCase();
    if (lower === "user-agent") {
      applies = value === "*" || value.toLowerCase() === userAgent.toLowerCase();
    } else if (applies && lower === "disallow" && value) {
      rules.push(value);
    }
  }
  return rules;
}

function pathBlocked(pathname: string, rules: string[]): boolean {
  for (const rule of rules) {
    if (rule === "/") return true;
    if (pathname.startsWith(rule)) return true;
  }
  return false;
}

/**
 * Best-effort robots.txt check. Returns true when fetch is allowed.
 * On robots fetch failure, allows the request (fail-open for resilience).
 */
export async function isUrlAllowedByRobots(url: string): Promise<boolean> {
  const parsed = new URL(url);
  const cacheKey = parsed.origin;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.allowed;
  }

  const robotsUrl = `${parsed.origin}/robots.txt`;
  try {
    const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, allowed: true });
      return true;
    }
    const body = await res.text();
    const rules = parseRobotsDisallow(body);
    const allowed = !pathBlocked(parsed.pathname, rules);
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, allowed });
    return allowed;
  } catch {
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, allowed: true });
    return true;
  }
}

export async function assertUrlAllowedByRobots(url: string): Promise<void> {
  const ok = await isUrlAllowedByRobots(url);
  if (!ok) {
    throw new Error(`Blocked by robots.txt: ${url}`);
  }
}

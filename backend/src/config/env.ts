import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_VERSION: z.string().default("v1"),

  DATABASE_URL: z.string().min(1),

  REDIS_URL: z.string().optional(),

  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  /** Comma-separated list of allowed browser origins (Vercel production + previews). */
  CORS_ORIGIN: z.string().optional(),

  COOKIE_DOMAIN: z.string().optional(),
  /** Set true in production when serving HTTPS so refresh cookies are secure. */
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),

  /** Google OAuth Web client ID (used to verify ID tokens from the Next.js app). */
  GOOGLE_CLIENT_ID: z.string().optional(),

  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

  /** Base URL for Python FastAPI (or other) ML services — no trailing slash. */
  ML_SERVICE_URL: z.string().url().optional(),
  ML_SERVICE_API_KEY: z.string().optional(),
  ML_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  ML_SERVICE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),

  /** Run BullMQ workers (use `npm run worker` or enable in API process — not recommended for serverless). */
  ENABLE_WORKERS: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),

  /** Register repeatable cron-style jobs on worker startup (requires Redis). */
  ENABLE_QUEUE_CRON: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),

  /** Local directory for HTML/PDF scrape snapshots (defaults to `./data/scrape-snapshots`). */
  SCRAPE_STORAGE_DIR: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export function getCorsOrigins(): string[] | true {
  if (!env.CORS_ORIGIN || env.CORS_ORIGIN.trim() === "") {
    return true;
  }
  return env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
}

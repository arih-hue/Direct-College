import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .optional()
    .transform((v) => v?.replace(/\/+$/, "") ?? "http://localhost:4000/api/v1"),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success && typeof window === "undefined") {
  console.warn("[env] Invalid NEXT_PUBLIC_API_URL — falling back to localhost.");
}

/**
 * Public env vars (embedded at build time). Must be prefixed with `NEXT_PUBLIC_`.
 */
export const publicEnv = {
  apiBaseUrl: parsed.success ? parsed.data.NEXT_PUBLIC_API_URL : "http://localhost:4000/api/v1",
} as const;

/** Site origin derived from API URL host or Vercel URL in production. */
export function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

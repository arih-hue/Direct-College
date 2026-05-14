/**
 * Public env vars (embedded at build time). Must be prefixed with `NEXT_PUBLIC_`.
 */
export const publicEnv = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
    "http://localhost:4000/api/v1",
} as const;

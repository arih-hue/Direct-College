import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/lib/env.public";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/profile"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

import { fetchSeoSitemap } from "@/lib/api/services/seo";
import { getSiteOrigin } from "@/lib/env.public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await fetchSeoSitemap();
    return data.urls.map((entry) => ({
      url: entry.loc,
      lastModified: entry.lastmod ? new Date(entry.lastmod) : undefined,
      changeFrequency: (entry.changefreq as MetadataRoute.Sitemap[number]["changeFrequency"]) ?? "weekly",
      priority: entry.priority,
    }));
  } catch {
    const base = getSiteOrigin();
    return [{ url: base, changeFrequency: "weekly", priority: 1 }];
  }
}

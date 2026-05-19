import { publicEnv } from "../../env.public";

export type SeoSitemapResponse = {
  baseUrl: string;
  urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>;
};

export async function fetchSeoSitemap(): Promise<SeoSitemapResponse> {
  const res = await fetch(`${publicEnv.apiBaseUrl}/seo/sitemap`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to load sitemap");
  const json = (await res.json()) as { success: boolean; data: SeoSitemapResponse };
  return json.data;
}

export async function fetchCollegeSeoMetadata(slug: string) {
  const res = await fetch(`${publicEnv.apiBaseUrl}/seo/colleges/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { success: boolean; data: unknown };
  return json.data;
}

export async function fetchFaqSchema() {
  const res = await fetch(`${publicEnv.apiBaseUrl}/seo/faq`, { next: { revalidate: 86400 } });
  const json = (await res.json()) as { success: boolean; data: unknown };
  return json.data;
}

export async function generateSlug(name: string) {
  const res = await fetch(`${publicEnv.apiBaseUrl}/seo/slug`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const json = (await res.json()) as { success: boolean; data: { slug: string } };
  return json.data.slug;
}

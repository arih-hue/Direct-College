import { prisma } from "../config/database.js";
import { getOrSet, stableCacheKey } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import { slugify } from "../utils/slugify.js";
import { env } from "../config/env.js";

const SITE_NAME = "Direct College";

function publicSiteBase(): string {
  const origins = env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
  return origins?.[0] ?? "https://directcollege.app";
}

export const seoService = {
  generateSlug(name: string): string {
    return slugify(name);
  },

  async sitemap() {
    const key = cacheKey(CacheNS.seo, "sitemap");
    const { data } = await getOrSet(key, CacheTTL.SEO, async () => {
      const colleges = await prisma.college.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      });
      const base = publicSiteBase();
      const staticPages = ["", "/explore", "/compare", "/strategy", "/resources", "/seniors"];
      return {
        baseUrl: base,
        urls: [
          ...staticPages.map((path) => ({
            loc: `${base}${path}`,
            changefreq: "weekly",
            priority: path === "" ? 1 : 0.8,
          })),
          ...colleges.map((c) => ({
            loc: `${base}/college/${c.slug}`,
            lastmod: c.updatedAt.toISOString(),
            changefreq: "weekly",
            priority: 0.7,
          })),
        ],
      };
    });
    return data;
  },

  async collegeMetadata(slug: string) {
    const key = cacheKey(CacheNS.seo, "college", slug);
    const { data } = await getOrSet(key, CacheTTL.SEO, async () => {
      const college = await prisma.college.findUnique({
        where: { slug },
        include: {
          _count: { select: { reviews: true, branches: true } },
        },
      });
      if (!college) return null;

      const base = publicSiteBase();
      const title = `${college.name} — Cutoffs, Placements & Reviews | ${SITE_NAME}`;
      const description = `Explore ${college.name}${college.city ? `, ${college.city}` : ""}${college.state ? `, ${college.state}` : ""}. Compare cutoffs, placements, branches, and student reviews on ${SITE_NAME}.`;

      return {
        title,
        description,
        canonical: `${base}/college/${college.slug}`,
        openGraph: {
          title,
          description,
          url: `${base}/college/${college.slug}`,
          type: "website",
          siteName: SITE_NAME,
        },
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          name: college.name,
          url: college.website ?? `${base}/college/${college.slug}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: college.city ?? undefined,
            addressRegion: college.state ?? undefined,
            addressCountry: college.country,
          },
        },
        stats: {
          reviews: college._count.reviews,
          branches: college._count.branches,
        },
      };
    });
    return data;
  },

  faqSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does the JEE college predictor work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Enter your JEE rank, category, home state, and branch preferences. We compare your rank against historical closing ranks and classify colleges as SAFE, MODERATE, or DREAM.",
          },
        },
        {
          "@type": "Question",
          name: "Are cutoff data official?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cutoffs are sourced from JoSAA, CSAB, and verified government datasets. Always confirm final allotments on official counseling portals.",
          },
        },
        {
          "@type": "Question",
          name: "Can I compare IITs and NITs side by side?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Use the Compare tool to evaluate placements, cutoffs, branches, and reviews across multiple colleges.",
          },
        },
      ],
    };
  },

  async dynamicPages(limit = 100) {
    const key = cacheKey(CacheNS.seo, "pages", String(limit));
    const { data } = await getOrSet(key, CacheTTL.SEO, async () => {
      const colleges = await prisma.college.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { slug: true, name: true, state: true, city: true, updatedAt: true },
      });
      const base = publicSiteBase();
      return colleges.map((c) => ({
        slug: c.slug,
        path: `/college/${c.slug}`,
        url: `${base}/college/${c.slug}`,
        title: c.name,
        state: c.state,
        city: c.city,
        updatedAt: c.updatedAt,
      }));
    });
    return data;
  },
};

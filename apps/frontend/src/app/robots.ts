import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://adryx.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Auth flows — no indexing value
          "/auth/",
          "/forgot-password",
          "/reset-password",
          // Advertiser dashboard (served at advertiser.adryx.xyz in prod)
          "/dashboard/",
          // Publisher dashboard (served at publisher.adryx.xyz in prod)
          "/publishers/",
          // Admin (served at admin.adryx.xyz in prod)
          "/admin/",
          // Next.js internals
          "/_next/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site-metadata";

/**
 * Dynamic robots.txt generator.
 * - Allows crawling of the entire public site
 * - Disallows `/admin/*` (requires auth) and `/api/*` (non-page routes)
 * - Advertises the dynamic sitemap
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

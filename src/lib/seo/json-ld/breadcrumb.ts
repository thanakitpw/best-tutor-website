import { SITE_URL } from "../site-metadata";
import type { BreadcrumbItem, JsonLdSchema } from "../types";

/**
 * BreadcrumbList schema — required on every public page per SEO-First rules.
 *
 * Accepts relative or absolute URLs; relative ones are resolved against
 * SITE_URL for consistency with canonical links.
 */
export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: resolveUrl(item.url),
    })),
  };
}

function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const prefix = url.startsWith("/") ? "" : "/";
  return `${SITE_URL}${prefix}${url}`;
}

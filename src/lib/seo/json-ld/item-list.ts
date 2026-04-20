import { SITE_URL } from "../site-metadata";
import type { JsonLdSchema, ListItem } from "../types";

/**
 * ItemList schema — used on `/tutors`, `/subject/[category]` and
 * `/subject/[category]/[sub]` to describe collection contents.
 *
 * Items are wrapped with an embedded `ListItem` that links back to the
 * detail page. Position values from the input are preserved.
 */
export function buildItemListSchema(items: readonly ListItem[]): JsonLdSchema {
  const sorted = [...items].sort((a, b) => a.position - b.position);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((item) => {
      const element: Record<string, unknown> = {
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        url: resolveUrl(item.url),
      };
      if (item.image) {
        element.image = item.image;
      }
      return element;
    }),
  };
}

function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const prefix = url.startsWith("/") ? "" : "/";
  return `${SITE_URL}${prefix}${url}`;
}

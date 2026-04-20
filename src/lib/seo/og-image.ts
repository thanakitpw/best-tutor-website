export type OgImageType = "tutor" | "article" | "subject";

/**
 * Build the path to a per-type dynamic OG image route.
 *
 * The actual route handlers will be added later (each type gets its own
 * `next/og` route). Until then this helper returns a stable path so page
 * metadata can reference the eventual URL without conditionals.
 */
export function buildOgImageUrl(slug: string, type: OgImageType): string {
  const sanitized = encodeURIComponent(slug.trim());
  return `/api/og/${type}/${sanitized}`;
}

import type { Metadata } from "next";

import {
  DEFAULT_OG_IMAGE,
  LOCALE,
  SITE_NAME,
  SITE_URL,
} from "./site-metadata";

export interface BuildMetadataOptions {
  /** Page title — will be rendered through the layout's title template. */
  title: string;
  /** Meta description — aim for 140-160 chars, include primary keyword. */
  description: string;
  /** Path relative to SITE_URL, must start with "/". */
  path: string;
  /** Absolute URL or path to custom OG image. Defaults to site OG image. */
  ogImage?: string;
  /** Page-specific keywords. Merged with site-wide keywords in layout. */
  keywords?: readonly string[];
  /** Override canonical. Defaults to `${SITE_URL}${path}`. */
  canonical?: string;
  /** Override OG type. Defaults to "website". */
  ogType?: "website" | "article" | "profile";
  /** Prevent indexing for this page. */
  noIndex?: boolean;
}

/**
 * Build a page-level `Metadata` object for Next.js App Router.
 *
 * Every public page must pass through this helper so OG/Twitter/canonical
 * stay in sync. Layout-level metadata (root title template, site name) still
 * applies — this helper only sets page-level overrides.
 */
export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    ogImage,
    keywords,
    canonical,
    ogType = "website",
    noIndex = false,
  } = opts;

  const resolvedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = canonical ?? `${SITE_URL}${resolvedPath}`;
  const ogImageUrl = resolveOgImage(ogImage);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: LOCALE,
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

function resolveOgImage(ogImage: string | undefined): string {
  const target = ogImage ?? DEFAULT_OG_IMAGE;
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  const prefix = target.startsWith("/") ? "" : "/";
  return `${SITE_URL}${prefix}${target}`;
}

// Site-wide SEO constants. Single source of truth for domain, brand strings,
// and organization contact information. Organization contact values are
// placeholders — they will be surfaced from the admin settings table later.

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://besttutorthailand.com";

export const SITE_NAME = "Best Tutor Thailand" as const;

export const SITE_TAGLINE = "เป้าหมายของคุณ ความสำเร็จของเรา" as const;

export const SITE_DESCRIPTION =
  "แพลตฟอร์มจับคู่นักเรียนกับติวเตอร์คุณภาพ สอนพิเศษตัวต่อตัว ทั้งที่บ้านและออนไลน์ ครอบคลุมทุกวิชา — เป้าหมายของคุณ ความสำเร็จของเรา" as const;

// Default OG image path — served by `src/app/opengraph-image.tsx` via next/og.
export const DEFAULT_OG_IMAGE = "/opengraph-image" as const;

// Locale tag for OpenGraph + schema.org. Site is Thai-first.
export const LOCALE = "th_TH" as const;

// Organization contact — placeholders; update via admin settings in Phase 8.
export const ORGANIZATION_TELEPHONE = "+66-000-000-000" as const;
export const ORGANIZATION_EMAIL = "contact@besttutorthailand.com" as const;
export const ORGANIZATION_ADDRESS = {
  streetAddress: "—",
  addressLocality: "Bangkok",
  addressRegion: "Bangkok",
  postalCode: "10000",
  addressCountry: "TH",
} as const;

// Social profiles for Organization.sameAs — fill once client confirms handles.
export const ORGANIZATION_SAME_AS: readonly string[] = [] as const;

// Logo path served from /public. Replace with Cloudinary URL later.
export const ORGANIZATION_LOGO_URL = `${SITE_URL}/logo.png` as const;

// Brand color used in generated OG images.
export const BRAND_COLOR_PRIMARY = "#046bd2" as const;
export const BRAND_COLOR_PRIMARY_HOVER = "#045cb4" as const;

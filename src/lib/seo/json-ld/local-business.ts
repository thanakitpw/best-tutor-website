import {
  ORGANIZATION_ADDRESS,
  ORGANIZATION_EMAIL,
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_SAME_AS,
  ORGANIZATION_TELEPHONE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../site-metadata";
import type { JsonLdSchema } from "../types";

/**
 * LocalBusiness schema — used on homepage + contact pages. Improves local
 * pack placement for queries like "ติวเตอร์ กรุงเทพ".
 *
 * Uses `EducationalOrganization` sub-type which is more specific for a tutor
 * matching platform than the generic `LocalBusiness`.
 */
export function buildLocalBusinessSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "@id": `${SITE_URL}#localbusiness`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: ORGANIZATION_TELEPHONE,
    email: ORGANIZATION_EMAIL,
    image: ORGANIZATION_LOGO_URL,
    logo: ORGANIZATION_LOGO_URL,
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION_ADDRESS,
    },
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    priceRange: "฿฿",
    sameAs: [...ORGANIZATION_SAME_AS],
  };
}

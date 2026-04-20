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
 * Organization schema — used on the homepage and can be referenced via @id
 * from other schemas (e.g. Article.publisher).
 */
export function buildOrganizationSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO_URL,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: ORGANIZATION_TELEPHONE,
        email: ORGANIZATION_EMAIL,
        contactType: "customer support",
        areaServed: "TH",
        availableLanguage: ["th", "en"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION_ADDRESS,
    },
    sameAs: [...ORGANIZATION_SAME_AS],
  };
}

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../site-metadata";
import type { JsonLdSchema } from "../types";

/**
 * WebSite + SearchAction — enables the Google sitelink search box.
 * Search target points at `/tutors?q={query}` per SEO audit.
 */
export function buildWebSiteSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "th-TH",
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tutors?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

import type { FaqItem, JsonLdSchema } from "../types";

/**
 * FAQPage schema — use on any page with a Q&A section (homepage, find-tutor,
 * join-with-us). Google renders these as expandable rich snippets.
 */
export function buildFaqSchema(items: readonly FaqItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

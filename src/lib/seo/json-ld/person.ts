import { SITE_NAME, SITE_URL } from "../site-metadata";
import type { JsonLdSchema, SeoTutor } from "../types";

/**
 * Build a Person schema for a tutor profile page.
 *
 * Includes `worksFor` pointing back to the Organization @id, `knowsAbout`
 * with the list of subjects taught, and optional `aggregateRating` when the
 * tutor has reviews. Consumers should also render the Review schema list
 * separately via `buildReviewSchema`.
 */
export function buildPersonSchema(tutor: SeoTutor): JsonLdSchema {
  const displayName = formatTutorName(tutor);
  const profileUrl = `${SITE_URL}/tutor/${tutor.slug}`;
  const subjectsTaught = (tutor.subjects ?? []).map((s) => s.name);

  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: displayName,
    url: profileUrl,
    jobTitle: "ติวเตอร์",
    worksFor: { "@id": `${SITE_URL}#organization`, "@type": "Organization", name: SITE_NAME },
  };

  if (tutor.profileImageUrl) {
    schema.image = tutor.profileImageUrl;
  }

  if (tutor.bio) {
    schema.description = tutor.bio;
  }

  if (tutor.education) {
    schema.alumniOf = {
      "@type": "EducationalOrganization",
      name: tutor.education,
    };
  }

  if (subjectsTaught.length > 0) {
    schema.knowsAbout = subjectsTaught;
  }

  if (
    typeof tutor.averageRating === "number" &&
    typeof tutor.reviewCount === "number" &&
    tutor.reviewCount > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(tutor.averageRating.toFixed(2)),
      reviewCount: tutor.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

function formatTutorName(tutor: SeoTutor): string {
  const parts = [tutor.nickname, tutor.firstName, tutor.lastName].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0,
  );
  return parts.length > 0 ? parts.join(" ") : "ติวเตอร์";
}

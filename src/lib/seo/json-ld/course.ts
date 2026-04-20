import { SITE_NAME, SITE_URL } from "../site-metadata";
import type { JsonLdSchema, SeoCourse } from "../types";

/**
 * Course schema — used on course detail pages. `provider` references the
 * site Organization @id. Duration is emitted in ISO 8601 format when a
 * positive value is provided.
 */
export function buildCourseSchema(course: SeoCourse): JsonLdSchema {
  const url = course.slug ? `${SITE_URL}/courses/${course.slug}` : SITE_URL;

  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    url,
    provider: {
      "@id": `${SITE_URL}#organization`,
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  if (course.description) {
    schema.description = course.description;
  }

  if (course.featuredImageUrl) {
    schema.image = course.featuredImageUrl;
  }

  if (typeof course.durationHours === "number" && course.durationHours > 0) {
    // ISO 8601 duration format: PT{n}H
    schema.timeRequired = `PT${course.durationHours}H`;
  }

  return schema;
}

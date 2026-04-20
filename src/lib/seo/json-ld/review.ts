import type { JsonLdSchema, SeoReview } from "../types";

export interface BuildReviewSchemaOptions {
  /** URL or @id of the thing being reviewed. */
  itemReviewedId: string;
  /** Schema.org type of the thing being reviewed, e.g. "Person", "Course". */
  itemReviewedType: string;
  /** Name of the thing being reviewed (for embedded itemReviewed). */
  itemReviewedName: string;
}

/**
 * Build a single Review schema for a tutor review.
 */
export function buildReviewSchema(
  review: SeoReview,
  opts: BuildReviewSchemaOptions,
): JsonLdSchema {
  const createdAt =
    review.createdAt instanceof Date
      ? review.createdAt.toISOString()
      : new Date(review.createdAt).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.reviewerName,
    },
    datePublished: createdAt,
    reviewBody: review.comment ?? "",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      "@id": opts.itemReviewedId,
      "@type": opts.itemReviewedType,
      name: opts.itemReviewedName,
    },
  };
}

/**
 * Build an aggregate rating summary from a list of reviews. Returns null when
 * there are no reviews — consumers should skip emitting the schema in that
 * case (Google guidelines: don't emit empty ratings).
 */
export function buildAggregateRatingSchema(
  reviews: readonly SeoReview[],
): JsonLdSchema | null {
  if (reviews.length === 0) {
    return null;
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / reviews.length;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: Number(average.toFixed(2)),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

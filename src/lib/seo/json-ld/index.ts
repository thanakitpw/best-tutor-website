// Barrel export for all JSON-LD schema builders. Import from this module
// in page components so renaming/moving individual builders doesn't ripple
// into page code.

export { buildArticleSchema } from "./article";
export { buildBreadcrumbSchema } from "./breadcrumb";
export { buildCourseSchema } from "./course";
export { buildFaqSchema } from "./faq";
export { buildItemListSchema } from "./item-list";
export { buildLocalBusinessSchema } from "./local-business";
export { buildOrganizationSchema } from "./organization";
export { buildPersonSchema } from "./person";
export {
  buildAggregateRatingSchema,
  buildReviewSchema,
  type BuildReviewSchemaOptions,
} from "./review";
export { buildWebSiteSchema } from "./website";

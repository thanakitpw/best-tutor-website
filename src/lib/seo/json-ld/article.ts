import {
  ORGANIZATION_LOGO_URL,
  SITE_NAME,
  SITE_URL,
} from "../site-metadata";
import type { JsonLdSchema, SeoArticle } from "../types";

/**
 * Build an Article schema for blog posts.
 *
 * `publisher` references the Organization @id so the same entity appears
 * once across the page. `datePublished` is required for Article rich
 * results — we fall back to `updatedAt` when the article predates the CMS.
 */
export function buildArticleSchema(article: SeoArticle): JsonLdSchema {
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const published = toIso(article.publishedAt) ?? toIso(article.updatedAt);
  const modified = toIso(article.updatedAt) ?? published;

  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: article.title,
    url: articleUrl,
    inLanguage: "th-TH",
    publisher: {
      "@id": `${SITE_URL}#organization`,
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: ORGANIZATION_LOGO_URL },
    },
  };

  if (article.excerpt) {
    schema.description = article.excerpt;
  }

  if (article.featuredImageUrl) {
    schema.image = [article.featuredImageUrl];
  }

  if (article.author?.name) {
    schema.author = {
      "@type": "Person",
      name: article.author.name,
    };
  }

  if (published) {
    schema.datePublished = published;
  }
  if (modified) {
    schema.dateModified = modified;
  }

  if (article.category) {
    schema.articleSection = article.category;
  }

  return schema;
}

function toIso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

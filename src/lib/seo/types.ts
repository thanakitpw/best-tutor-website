// Structural types used by JSON-LD builders and sitemap. Defined locally so
// this package can compile before Prisma models exist (Phase 2.1). Once
// `@prisma/client` is generated, consumers can pass Prisma rows directly —
// these shapes are designed to be a subset of the Prisma model.

// ---- Core enums (mirror Prisma — DO NOT import from @prisma/client) --------

export type TutorStatus = "PENDING" | "APPROVED" | "REJECTED" | "INACTIVE";
export type ArticleStatus = "DRAFT" | "PUBLISHED";

// ---- Tutor -----------------------------------------------------------------

export interface SeoSubject {
  id: string;
  name: string;
  slug: string;
}

export interface SeoSubjectCategory {
  id: string;
  name: string;
  slug: string;
  subjects?: SeoSubject[];
  updatedAt?: Date | string | null;
}

export interface SeoTutor {
  id: string;
  slug: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  education?: string | null;
  teachingExperience?: number | null;
  subjects?: SeoSubject[];
  averageRating?: number | null;
  reviewCount?: number | null;
  updatedAt?: Date | string | null;
}

// ---- Article ---------------------------------------------------------------

export interface SeoArticleAuthor {
  id: string;
  name: string | null;
}

export interface SeoArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  category?: string | null;
  author?: SeoArticleAuthor | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

// ---- Review ----------------------------------------------------------------

export interface SeoReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment?: string | null;
  createdAt: Date | string;
}

// ---- Course ----------------------------------------------------------------

export interface SeoCourse {
  id: string;
  title: string;
  description?: string | null;
  durationHours?: number | null;
  featuredImageUrl?: string | null;
  slug?: string | null;
}

// ---- Breadcrumb / FAQ / ItemList helpers -----------------------------------

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ListItem {
  name: string;
  url: string;
  position: number;
  image?: string | null;
}

// ---- Shared JSON-LD envelope ----------------------------------------------

/**
 * Minimal JSON-LD envelope. All builders return a plain object with
 * `@context` + `@type` rather than pulling in the heavy `schema-dts` package.
 */
export type JsonLdSchema = Record<string, unknown> & {
  "@context": "https://schema.org";
  "@type": string | readonly string[];
};

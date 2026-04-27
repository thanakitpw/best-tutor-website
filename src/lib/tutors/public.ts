/**
 * Public-facing tutor data layer.
 *
 * Server-only Prisma queries that produce the shape consumed by the public
 * site (homepage, /tutors, /subject/*, /tutor/[slug], /find-tutor preview,
 * /review). Filters out non-APPROVED tutors so the public site never shows
 * pending or rejected profiles.
 *
 * Replaces the prior `MOCK_FEATURED_TUTORS` + synthetic `buildListingTutorPool`
 * pipeline. Components retain the same `PublicTutor` / `ListingTutor` shape so
 * UI did not need a rewrite.
 */
import "server-only";

import { TutorStatus, type Gender, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ListingTutor, PublicTutor } from "./types";

export type { ListingTutor, PublicTutor };

// ── Internal: Prisma query shape ──────────────────────────────────────────────

const tutorSelect = {
  slug: true,
  nickname: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  address: true,
  education: true,
  isPopular: true,
  teachingExperienceYears: true,
  gender: true,
  tutorSubjects: {
    select: {
      subject: {
        select: { name: true, slug: true, categoryId: true },
      },
    },
  },
  reviews: {
    where: { isVisible: true },
    select: { rating: true },
  },
} satisfies Prisma.TutorSelect;

type TutorRow = Prisma.TutorGetPayload<{ select: typeof tutorSelect }>;

// ── Mappers ───────────────────────────────────────────────────────────────────

function aggregateReviews(reviews: { rating: number }[]): {
  rating: number;
  reviewCount: number;
} {
  if (reviews.length === 0) return { rating: 0, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  };
}

function genderToLabel(g: Gender | null): "ชาย" | "หญิง" {
  // Default to หญิง when unset — most existing tutors are female and this is
  // only used for the gender filter, not displayed on the profile itself.
  return g === "MALE" ? "ชาย" : "หญิง";
}

function rowToPublic(row: TutorRow): PublicTutor {
  const { rating, reviewCount } = aggregateReviews(row.reviews);
  return {
    slug: row.slug,
    nickname: row.nickname,
    firstName: row.firstName,
    lastName: row.lastName,
    profileImageUrl: row.profileImageUrl,
    rating,
    reviewCount,
    subjects: row.tutorSubjects.map((ts) => ts.subject.name),
    province: row.address,
    education: row.education ?? "",
    isPopular: row.isPopular,
  };
}

function rowToListing(row: TutorRow): ListingTutor {
  return {
    ...rowToPublic(row),
    experienceYears: row.teachingExperienceYears,
    gender: genderToLabel(row.gender),
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

/** Featured tutors for the homepage — popular + APPROVED, newest first. */
export async function getFeaturedTutors(limit = 6): Promise<PublicTutor[]> {
  const rows = await prisma.tutor.findMany({
    where: { status: TutorStatus.APPROVED, isPopular: true },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
    select: tutorSelect,
  });
  return rows.map(rowToPublic);
}

/** Single tutor profile by slug — null if not found or not APPROVED. */
export async function getTutorBySlug(slug: string): Promise<PublicTutor | null> {
  const row = await prisma.tutor.findFirst({
    where: { slug, status: TutorStatus.APPROVED },
    select: tutorSelect,
  });
  return row ? rowToPublic(row) : null;
}

/** Slugs for `generateStaticParams` — all APPROVED tutors. */
export async function getAllPublicTutorSlugs(): Promise<{ slug: string }[]> {
  const rows = await prisma.tutor.findMany({
    where: { status: TutorStatus.APPROVED },
    select: { slug: true },
  });
  return rows;
}

/**
 * Other APPROVED tutors who teach at least one of the given subjects.
 * Used by the "ติวเตอร์ท่านอื่น..." row at the bottom of /tutor/[slug].
 */
export async function getRelatedTutors(args: {
  excludeSlug: string;
  subjectSlugs: readonly string[];
  limit?: number;
}): Promise<PublicTutor[]> {
  const { excludeSlug, subjectSlugs, limit = 3 } = args;
  if (subjectSlugs.length === 0) return [];

  const rows = await prisma.tutor.findMany({
    where: {
      status: TutorStatus.APPROVED,
      slug: { not: excludeSlug },
      tutorSubjects: {
        some: { subject: { slug: { in: [...subjectSlugs] } } },
      },
    },
    orderBy: [{ isPopular: "desc" }, { updatedAt: "desc" }],
    take: limit,
    select: tutorSelect,
  });
  return rows.map(rowToPublic);
}

/** All APPROVED tutors teaching a given subject category (by category slug). */
export async function getListingTutorsForCategory(
  categorySlug: string,
): Promise<ListingTutor[]> {
  const rows = await prisma.tutor.findMany({
    where: {
      status: TutorStatus.APPROVED,
      tutorSubjects: {
        some: { subject: { category: { slug: categorySlug } } },
      },
    },
    orderBy: [{ isPopular: "desc" }, { updatedAt: "desc" }],
    select: tutorSelect,
  });
  return rows.map(rowToListing);
}

/** All APPROVED tutors teaching a specific sub-subject (by subject slug). */
export async function getListingTutorsForSubject(
  subjectSlug: string,
): Promise<ListingTutor[]> {
  const rows = await prisma.tutor.findMany({
    where: {
      status: TutorStatus.APPROVED,
      tutorSubjects: { some: { subject: { slug: subjectSlug } } },
    },
    orderBy: [{ isPopular: "desc" }, { updatedAt: "desc" }],
    select: tutorSelect,
  });
  return rows.map(rowToListing);
}

/** Subject slugs taught by a given tutor — used to power related-tutor lookups. */
export async function getTutorSubjectSlugs(tutorSlug: string): Promise<string[]> {
  const row = await prisma.tutor.findUnique({
    where: { slug: tutorSlug },
    select: {
      tutorSubjects: { select: { subject: { select: { slug: true } } } },
    },
  });
  return row?.tutorSubjects.map((ts) => ts.subject.slug) ?? [];
}

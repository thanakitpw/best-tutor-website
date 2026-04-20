/**
 * GET /api/tutors/[slug]
 *
 * Full tutor profile for `/tutor/[slug]` pages. Only returns tutors with
 * status = APPROVED (drafts/pending must never leak).
 *
 * Includes:
 *   - Tutor fields (incl. SEO metadata)
 *   - Subjects (name + slug + parent category)
 *   - Latest 20 visible reviews
 *   - Review stats: total, avg, 1..5 rating distribution
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api/responses";
import { CACHE_TUTORS } from "@/lib/api/cache";

export const runtime = "nodejs";
export const revalidate = 60;

const MAX_REVIEWS_EMBEDDED = 20;

const reviewItemSchema = z.object({
  id: z.string(),
  reviewerName: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  images: z.array(z.string()),
  isVerified: z.boolean(),
  adminReply: z.string().nullable(),
  createdAt: z.string(), // ISO
});

const subjectRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.object({ id: z.string(), name: z.string(), slug: z.string() }),
});

const ratingStatsSchema = z.object({
  average: z.number().nonnegative().max(5),
  total: z.number().int().nonnegative(),
  distribution: z.object({
    1: z.number().int().nonnegative(),
    2: z.number().int().nonnegative(),
    3: z.number().int().nonnegative(),
    4: z.number().int().nonnegative(),
    5: z.number().int().nonnegative(),
  }),
});

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tutorDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  nickname: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
  profileImageUrl: z.string().nullable(),
  education: z.string().nullable(),
  occupation: z.string().nullable(),
  teachingExperienceYears: z.number().int().nonnegative(),
  teachingStyle: z.string().nullable(),
  subjectsTaught: z.string().nullable(),
  ratePricing: z.string().nullable(),
  address: z.string().nullable(),
  vehicleType: z.string().nullable(),
  isPopular: z.boolean(),
  // SEO
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),

  subjects: z.array(subjectRefSchema),
  reviews: z.array(reviewItemSchema),
  ratingStats: ratingStatsSchema,
});

export type GetTutorBySlugResponse = z.infer<typeof tutorDetailSchema>;
export type TutorReviewItem = z.infer<typeof reviewItemSchema>;
export type TutorRatingStats = z.infer<typeof ratingStatsSchema>;

const paramsSchema = z.object({ slug: z.string().min(1).max(160) });

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const parsed = paramsSchema.safeParse(await ctx.params);
    if (!parsed.success) {
      return fail(400, "slug ไม่ถูกต้อง");
    }
    const { slug } = parsed.data;

    const tutor = await prisma.tutor.findUnique({
      where: { slug },
      include: {
        tutorSubjects: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
                slug: true,
                category: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
          },
        },
        reviews: {
          where: { isVisible: true },
          orderBy: { createdAt: "desc" },
          take: MAX_REVIEWS_EMBEDDED,
          select: {
            id: true,
            reviewerName: true,
            rating: true,
            comment: true,
            images: true,
            isVerified: true,
            adminReply: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tutor || tutor.status !== "APPROVED") {
      return fail(404, "ไม่พบติวเตอร์ที่คุณค้นหา");
    }

    // Rating distribution via a single groupBy (visible reviews only).
    const distributionRows = await prisma.review.groupBy({
      by: ["rating"],
      where: { tutorId: tutor.id, isVisible: true },
      _count: { _all: true },
    });
    const distribution: TutorRatingStats["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let weightedSum = 0;
    for (const row of distributionRows) {
      const r = clampRating(row.rating);
      distribution[r] = row._count._all;
      total += row._count._all;
      weightedSum += r * row._count._all;
    }
    const average = total === 0 ? 0 : Math.round((weightedSum / total) * 10) / 10;

    const payload: GetTutorBySlugResponse = {
      id: tutor.id,
      slug: tutor.slug,
      nickname: tutor.nickname,
      firstName: tutor.firstName,
      lastName: tutor.lastName,
      gender: tutor.gender,
      profileImageUrl: tutor.profileImageUrl,
      education: tutor.education,
      occupation: tutor.occupation,
      teachingExperienceYears: tutor.teachingExperienceYears,
      teachingStyle: tutor.teachingStyle,
      subjectsTaught: tutor.subjectsTaught,
      ratePricing: tutor.ratePricing,
      address: tutor.address,
      vehicleType: tutor.vehicleType,
      isPopular: tutor.isPopular,
      seoTitle: tutor.seoTitle,
      seoDescription: tutor.seoDescription,
      seoKeywords: tutor.seoKeywords,
      ogImageUrl: tutor.ogImageUrl,
      canonicalUrl: tutor.canonicalUrl,
      createdAt: tutor.createdAt.toISOString(),
      updatedAt: tutor.updatedAt.toISOString(),
      subjects: tutor.tutorSubjects.map((ts) => ts.subject),
      reviews: tutor.reviews.map((r) => ({
        id: r.id,
        reviewerName: r.reviewerName,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        isVerified: r.isVerified,
        adminReply: r.adminReply,
        createdAt: r.createdAt.toISOString(),
      })),
      ratingStats: { average, total, distribution },
    };

    return ok(payload, { cacheControl: CACHE_TUTORS });
  } catch (error) {
    console.error("[GET /api/tutors/[slug]] failed:", error);
    return fail(500, "ไม่สามารถโหลดข้อมูลติวเตอร์ได้");
  }
}

function clampRating(n: number): 1 | 2 | 3 | 4 | 5 {
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return Math.round(n) as 1 | 2 | 3 | 4 | 5;
}

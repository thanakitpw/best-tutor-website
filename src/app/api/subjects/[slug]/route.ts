/**
 * GET /api/subjects/[slug]
 *
 * Slug resolver that checks BOTH taxonomy tables:
 *   1. SubjectCategory.slug  → returns category + its subjects
 *   2. Subject.slug          → returns subject + parent category + tutor count
 *
 * This lets the Frontend use a single endpoint for either
 * `/subject/[category]` or `/subject/[category]/[sub]` pages.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api/responses";
import { CACHE_SUBJECTS } from "@/lib/api/cache";

export const runtime = "nodejs";
export const revalidate = 3600;

const subjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number().int(),
});

const categoryPayloadSchema = z.object({
  kind: z.literal("category"),
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
  sortOrder: z.number().int(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  subjects: z.array(subjectSummarySchema),
  tutorCount: z.number().int().nonnegative(),
});

const subjectPayloadSchema = z.object({
  kind: z.literal("subject"),
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number().int(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  tutorCount: z.number().int().nonnegative(),
});

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubjectBySlugResponseSchema = z.discriminatedUnion("kind", [
  categoryPayloadSchema,
  subjectPayloadSchema,
]);

export type GetSubjectBySlugResponse = z.infer<typeof getSubjectBySlugResponseSchema>;
export type SubjectCategoryDetail = z.infer<typeof categoryPayloadSchema>;
export type SubjectDetail = z.infer<typeof subjectPayloadSchema>;

const paramsSchema = z.object({ slug: z.string().min(1).max(120) });

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

    // Try category first (cheap single-key lookup).
    const category = await prisma.subjectCategory.findUnique({
      where: { slug },
      include: {
        subjects: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, slug: true, sortOrder: true },
        },
      },
    });

    if (category) {
      // Count APPROVED tutors whose subjects belong to this category.
      const tutorCount = await prisma.tutor.count({
        where: {
          status: "APPROVED",
          tutorSubjects: { some: { subject: { categoryId: category.id } } },
        },
      });

      const payload: GetSubjectBySlugResponse = {
        kind: "category",
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        seoKeywords: category.seoKeywords,
        ogImageUrl: category.ogImageUrl,
        canonicalUrl: category.canonicalUrl,
        subjects: category.subjects,
        tutorCount,
      };
      return ok(payload, { cacheControl: CACHE_SUBJECTS });
    }

    const subject = await prisma.subject.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!subject) {
      return fail(404, "ไม่พบวิชานี้");
    }

    const tutorCount = await prisma.tutor.count({
      where: {
        status: "APPROVED",
        tutorSubjects: { some: { subjectId: subject.id } },
      },
    });

    const payload: GetSubjectBySlugResponse = {
      kind: "subject",
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      sortOrder: subject.sortOrder,
      seoTitle: subject.seoTitle,
      seoDescription: subject.seoDescription,
      seoKeywords: subject.seoKeywords,
      ogImageUrl: subject.ogImageUrl,
      canonicalUrl: subject.canonicalUrl,
      category: subject.category,
      tutorCount,
    };
    return ok(payload, { cacheControl: CACHE_SUBJECTS });
  } catch (error) {
    console.error("[GET /api/subjects/[slug]] failed:", error);
    return fail(500, "ไม่สามารถโหลดข้อมูลวิชาได้");
  }
}

/**
 * GET /api/subjects
 *
 * Returns every subject category with its nested subjects, sorted by
 * `sortOrder` (matches the homepage navigation order).
 *
 * Public, cached. Subjects rarely change — 1h ISR + long SWR is fine.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api/responses";
import { CACHE_SUBJECTS } from "@/lib/api/cache";

export const runtime = "nodejs";
// Incremental Static Regeneration: re-run this once an hour at most.
export const revalidate = 3600;

const subjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number().int(),
});

const categoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
  sortOrder: z.number().int(),
  subjects: z.array(subjectItemSchema),
});

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubjectsResponseSchema = z.object({
  items: z.array(categoryItemSchema),
});

export type GetSubjectsResponse = z.infer<typeof getSubjectsResponseSchema>;
export type SubjectCategoryListItem = z.infer<typeof categoryItemSchema>;
export type SubjectListItem = z.infer<typeof subjectItemSchema>;

export async function GET() {
  try {
    const categories = await prisma.subjectCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        subjects: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, slug: true, sortOrder: true },
        },
      },
    });

    const payload: GetSubjectsResponse = {
      items: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        subjects: cat.subjects,
      })),
    };

    return ok(payload, { cacheControl: CACHE_SUBJECTS });
  } catch (error) {
    console.error("[GET /api/subjects] failed:", error);
    return fail(500, "ไม่สามารถโหลดรายการวิชาได้ กรุณาลองใหม่");
  }
}

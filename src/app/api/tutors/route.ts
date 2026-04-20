/**
 * GET /api/tutors
 *
 * Public tutor list. Only APPROVED tutors are ever returned.
 *
 * Filters (all optional query params):
 *   - category       subject category slug
 *   - subject        subject slug
 *   - province       exact match on tutor.address contains
 *   - minRating      1–5   (avg rating threshold, visible reviews only)
 *   - maxPrice       number (rate_pricing is TEXT → best-effort numeric parse)
 *   - minExperience  int  (years)
 *   - sort           rating | popular | newest | price_asc (default: popular)
 *   - page, limit
 *
 * Returns list items with denormalized rating/reviewCount aggregated from
 * visible reviews, plus subject name list (not slugs — UI shows them as pills).
 */
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail, failValidation } from "@/lib/api/responses";
import {
  buildPaginated,
  computeSkipTake,
  paginationQuerySchema,
  type Paginated,
} from "@/lib/api/pagination";
import { CACHE_TUTORS } from "@/lib/api/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // filters vary per request

const sortSchema = z.enum(["rating", "popular", "newest", "price_asc"]).default("popular");

const getTutorsQuerySchema = paginationQuerySchema.extend({
  category: z.string().trim().min(1).max(120).optional(),
  subject: z.string().trim().min(1).max(120).optional(),
  province: z.string().trim().min(1).max(120).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  maxPrice: z.coerce.number().positive().max(1_000_000).optional(),
  minExperience: z.coerce.number().int().min(0).max(80).optional(),
  sort: sortSchema,
});

export type GetTutorsQuery = z.infer<typeof getTutorsQuerySchema>;

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tutorListItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  nickname: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profileImageUrl: z.string().nullable(),
  teachingExperienceYears: z.number().int().nonnegative(),
  ratePricing: z.string().nullable(),
  isPopular: z.boolean(),
  subjects: z.array(z.string()),
  rating: z.number().nonnegative().max(5),
  reviewCount: z.number().int().nonnegative(),
  province: z.string().nullable(),
  seoDescription: z.string().nullable(),
});

export type TutorListItem = z.infer<typeof tutorListItemSchema>;
export type GetTutorsResponse = Paginated<TutorListItem>;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = getTutorsQuerySchema.safeParse(
      Object.fromEntries(url.searchParams.entries()),
    );
    if (!parsed.success) {
      return failValidation(parsed.error, "พารามิเตอร์ค้นหาไม่ถูกต้อง");
    }
    const query = parsed.data;
    const { skip, take } = computeSkipTake(query);

    // --- Build WHERE clause ---------------------------------------------------
    const where: Prisma.TutorWhereInput = { status: "APPROVED" };
    const subjectFilters: Prisma.SubjectWhereInput[] = [];

    if (query.subject) {
      subjectFilters.push({ slug: query.subject });
    }
    if (query.category) {
      subjectFilters.push({ category: { slug: query.category } });
    }
    if (subjectFilters.length) {
      where.tutorSubjects = {
        some: {
          subject:
            subjectFilters.length === 1
              ? subjectFilters[0]
              : { AND: subjectFilters },
        },
      };
    }

    if (query.province) {
      // address field holds free-text including province; contains-search is
      // pragmatic until we split address into structured columns.
      where.address = { contains: query.province, mode: "insensitive" };
    }
    if (typeof query.minExperience === "number") {
      where.teachingExperienceYears = { gte: query.minExperience };
    }

    // --- Sorting --------------------------------------------------------------
    // Note: `rating` and `price_asc` require post-query sorting because we
    // derive them from reviews / parsed text. `popular` + `newest` are
    // DB-sorted for cheapness.
    let orderBy: Prisma.TutorOrderByWithRelationInput[] = [
      { isPopular: "desc" },
      { createdAt: "desc" },
    ];
    if (query.sort === "newest") {
      orderBy = [{ createdAt: "desc" }];
    }

    // For rating/price sorts we must fetch candidates wider then re-rank.
    // We cap at 500 to bound the in-memory work; realistic tutor count is
    // ~100s so this stays tight.
    const useInMemorySort =
      query.sort === "rating" ||
      query.sort === "price_asc" ||
      typeof query.minRating === "number" ||
      typeof query.maxPrice === "number";

    const candidatesTake = useInMemorySort ? 500 : take;
    const candidatesSkip = useInMemorySort ? 0 : skip;

    const [candidates, unfilteredTotal] = await Promise.all([
      prisma.tutor.findMany({
        where,
        orderBy,
        skip: candidatesSkip,
        take: candidatesTake,
        select: {
          id: true,
          slug: true,
          nickname: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          teachingExperienceYears: true,
          ratePricing: true,
          isPopular: true,
          address: true,
          seoDescription: true,
          createdAt: true,
          tutorSubjects: {
            select: { subject: { select: { name: true, slug: true } } },
          },
        },
      }),
      prisma.tutor.count({ where }),
    ]);

    // --- Aggregate rating per tutor ------------------------------------------
    const tutorIds = candidates.map((t) => t.id);
    const ratingRows = tutorIds.length
      ? await prisma.review.groupBy({
          by: ["tutorId"],
          where: { tutorId: { in: tutorIds }, isVisible: true },
          _avg: { rating: true },
          _count: { _all: true },
        })
      : [];
    const ratingMap = new Map<
      string,
      { rating: number; reviewCount: number }
    >();
    for (const row of ratingRows) {
      ratingMap.set(row.tutorId, {
        rating: row._avg.rating ?? 0,
        reviewCount: row._count._all,
      });
    }

    // --- Project + filter + sort ---------------------------------------------
    let enriched = candidates.map((t): TutorListItem => {
      const agg = ratingMap.get(t.id);
      return {
        id: t.id,
        slug: t.slug,
        nickname: t.nickname,
        firstName: t.firstName,
        lastName: t.lastName,
        profileImageUrl: t.profileImageUrl,
        teachingExperienceYears: t.teachingExperienceYears,
        ratePricing: t.ratePricing,
        isPopular: t.isPopular,
        subjects: t.tutorSubjects.map((ts) => ts.subject.name),
        rating: agg ? roundTo1(agg.rating) : 0,
        reviewCount: agg?.reviewCount ?? 0,
        province: extractProvince(t.address),
        seoDescription: t.seoDescription,
      };
    });

    if (typeof query.minRating === "number") {
      const threshold = query.minRating;
      enriched = enriched.filter((t) => t.rating >= threshold);
    }
    if (typeof query.maxPrice === "number") {
      const cap = query.maxPrice;
      enriched = enriched.filter((t) => {
        const parsed = parsePrice(t.ratePricing);
        // If we can't parse, keep the tutor — don't hide them silently.
        return parsed === null ? true : parsed <= cap;
      });
    }

    if (query.sort === "rating") {
      enriched.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (query.sort === "price_asc") {
      enriched.sort((a, b) => {
        const pa = parsePrice(a.ratePricing);
        const pb = parsePrice(b.ratePricing);
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return pa - pb;
      });
    }

    // When filters applied in-memory, paginate slice here.
    let items: TutorListItem[];
    let total: number;
    if (useInMemorySort) {
      total = enriched.length;
      items = enriched.slice(skip, skip + take);
    } else {
      total = unfilteredTotal;
      items = enriched;
    }

    const response: GetTutorsResponse = buildPaginated(items, total, query);
    return ok(response, { cacheControl: CACHE_TUTORS });
  } catch (error) {
    console.error("[GET /api/tutors] failed:", error);
    return fail(500, "ไม่สามารถโหลดรายชื่อติวเตอร์ได้");
  }
}

/**
 * Best-effort price parse. `rate_pricing` is a free-form TEXT column, e.g.
 *   "500 บาท/ชม.", "400-600/ชม.", "400 THB/hr"
 * We grab the first run of digits and treat it as baht-per-hour. If parse
 * fails, return null so callers can skip the row.
 */
function parsePrice(raw: string | null): number | null {
  if (!raw) return null;
  const match = raw.match(/\d[\d,]*/);
  if (!match) return null;
  const num = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(num) ? num : null;
}

/** Last word/phrase of `address` is usually the province. */
function extractProvince(address: string | null): string | null {
  if (!address) return null;
  const trimmed = address.trim();
  if (!trimmed) return null;
  // Split on whitespace/comma; take last segment as best guess.
  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

function roundTo1(n: number): number {
  return Math.round(n * 10) / 10;
}

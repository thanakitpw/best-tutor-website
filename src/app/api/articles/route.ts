/**
 * GET /api/articles
 *
 * Public article list. Only PUBLISHED articles are returned, sorted by
 * `publishedAt` desc. Drafts must never leak.
 *
 * Query params:
 *   - category?  — article category (free-form string on Article.category)
 *   - tag?       — single tag to filter by (Article.tags contains)
 *   - page, limit
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
import { CACHE_ARTICLES } from "@/lib/api/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getArticlesQuerySchema = paginationQuerySchema.extend({
  category: z.string().trim().min(1).max(120).optional(),
  tag: z.string().trim().min(1).max(120).optional(),
});

export type GetArticlesQuery = z.infer<typeof getArticlesQuerySchema>;

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const articleListItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
  featuredImageUrl: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  publishedAt: z.string().nullable(), // ISO
  authorName: z.string().nullable(),
});

export type ArticleListItem = z.infer<typeof articleListItemSchema>;
export type GetArticlesResponse = Paginated<ArticleListItem>;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = getArticlesQuerySchema.safeParse(
      Object.fromEntries(url.searchParams.entries()),
    );
    if (!parsed.success) {
      return failValidation(parsed.error, "พารามิเตอร์ค้นหาไม่ถูกต้อง");
    }
    const query = parsed.data;
    const { skip, take } = computeSkipTake(query);

    const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };
    if (query.category) {
      where.category = query.category;
    }
    if (query.tag) {
      where.tags = { has: query.tag };
    }

    const [rows, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImageUrl: true,
          category: true,
          tags: true,
          publishedAt: true,
          author: { select: { name: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    const items: ArticleListItem[] = rows.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      featuredImageUrl: a.featuredImageUrl,
      category: a.category,
      tags: a.tags,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      authorName: a.author?.name ?? null,
    }));

    const response: GetArticlesResponse = buildPaginated(items, total, query);
    return ok(response, { cacheControl: CACHE_ARTICLES });
  } catch (error) {
    console.error("[GET /api/articles] failed:", error);
    return fail(500, "ไม่สามารถโหลดรายการบทความได้");
  }
}

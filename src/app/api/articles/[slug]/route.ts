/**
 * GET /api/articles/[slug]
 *
 * Full article payload for `/blog/[slug]` pages. Includes Tiptap content JSON,
 * author, SEO metadata, and 3 related articles in the same category.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api/responses";
import { CACHE_ARTICLES } from "@/lib/api/cache";

export const runtime = "nodejs";
export const revalidate = 300;

const RELATED_LIMIT = 3;

const relatedArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
  featuredImageUrl: z.string().nullable(),
  publishedAt: z.string().nullable(),
});

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const articleDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  // Tiptap JSON — opaque to us, passthrough to Frontend renderer.
  content: z.unknown(),
  excerpt: z.string().nullable(),
  featuredImageUrl: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  // SEO
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z
    .object({ id: z.string(), name: z.string().nullable() })
    .nullable(),
  related: z.array(relatedArticleSchema),
});

export type GetArticleBySlugResponse = z.infer<typeof articleDetailSchema>;
export type RelatedArticle = z.infer<typeof relatedArticleSchema>;

const paramsSchema = z.object({ slug: z.string().min(1).max(200) });

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

    const article = await prisma.article.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!article || article.status !== "PUBLISHED") {
      return fail(404, "ไม่พบบทความนี้");
    }

    // Related articles: same category, published, different slug. Falls back
    // to empty if no category or no siblings.
    const related = article.category
      ? await prisma.article.findMany({
          where: {
            status: "PUBLISHED",
            category: article.category,
            NOT: { id: article.id },
          },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: RELATED_LIMIT,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImageUrl: true,
            publishedAt: true,
          },
        })
      : [];

    const payload: GetArticleBySlugResponse = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      featuredImageUrl: article.featuredImageUrl,
      category: article.category,
      tags: article.tags,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      seoKeywords: article.seoKeywords,
      ogImageUrl: article.ogImageUrl,
      canonicalUrl: article.canonicalUrl,
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: article.author
        ? { id: article.author.id, name: article.author.name }
        : null,
      related: related.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        featuredImageUrl: r.featuredImageUrl,
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      })),
    };

    return ok(payload, { cacheControl: CACHE_ARTICLES });
  } catch (error) {
    console.error("[GET /api/articles/[slug]] failed:", error);
    return fail(500, "ไม่สามารถโหลดบทความได้");
  }
}

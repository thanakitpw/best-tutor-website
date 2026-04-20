import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck2,
  Clock,
  Phone,
  Tag,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/public/article-card";
import { BlogCategoryChips } from "@/components/public/blog-category-chips";
import { BlogCategorySidebar } from "@/components/public/blog-category-sidebar";
import { BlogInlineCta } from "@/components/public/blog-inline-cta";
import { BlogReadingProgress } from "@/components/public/blog-reading-progress";
import { BlogSearch } from "@/components/public/blog-search";
import { BlogShareButtons } from "@/components/public/blog-share-buttons";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { EmptyState } from "@/components/public/empty-state";
import { CONTACT_INFO } from "@/components/public/mock-data";
import {
  BLOG_CATEGORIES,
  countArticlesByCategory,
  findCategory,
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  MOCK_ARTICLES,
  type MockArticle,
} from "@/components/public/mock-articles";
import { TableOfContents } from "@/components/public/table-of-contents";
import {
  estimateReadTime,
  extractTocFromContent,
  TiptapRenderer,
} from "@/components/public/tiptap-renderer";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site-metadata";

import { BlogHero } from "../_blog-hero";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * `/blog/[slug]` routes double-duty as both category pages and article pages.
 * Next 16 disallows sibling dynamic segments (`[category]` + `[slug]`) since
 * they cannot be distinguished at match time. We resolve the ambiguity here:
 * category slugs take precedence, and any remaining slugs are treated as
 * individual articles. Unknown slugs fall through to `notFound()`.
 */
export function generateStaticParams() {
  return [
    ...BLOG_CATEGORIES.map((c) => ({ slug: c.slug })),
    ...MOCK_ARTICLES.map((a) => ({ slug: a.slug })),
  ];
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (category) {
    const articles = getArticlesByCategory(category.slug);
    const count = articles.length;
    const title = `บทความ${category.name}${count > 0 ? ` ${count} บทความ` : ""} | Best Tutor Thailand`;
    const description = `${category.description} อัปเดตประจำปี 2026 โดยทีมงาน Best Tutor Thailand`;
    return buildMetadata({
      title,
      description,
      path: `/blog/${category.slug}`,
      keywords: [
        `บทความ${category.name}`,
        `ติวเตอร์${category.name}`,
        "Best Tutor Thailand",
        "เรียนพิเศษ",
      ],
    });
  }

  const article = getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({
      title: "ไม่พบบทความ | Best Tutor Thailand",
      description: "บทความที่คุณค้นหาไม่มีอยู่ในระบบ หรืออาจถูกย้าย",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: article.seoTitle ?? `${article.title} | Best Tutor Thailand`,
    description: article.seoDescription ?? article.excerpt,
    path: `/blog/${article.slug}`,
    ogType: "article",
    ogImage: article.featuredImageUrl,
    keywords: article.seoKeywords ?? article.tags,
  });
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;

  const category = findCategory(slug);
  if (category) {
    return <CategoryListing categorySlug={category.slug} />;
  }

  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}

// ---------------------------------------------------------------------------
// Category listing view

function CategoryListing({ categorySlug }: { categorySlug: string }) {
  const category = findCategory(categorySlug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);
  const counts = countArticlesByCategory();
  const total = getAllArticles().length;

  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "บทความ", url: "/blog" },
    { name: category.name, url: `/blog/${category.slug}` },
  ] as const;

  const schemas = [
    buildBreadcrumbSchema([...breadcrumbItems]),
    buildItemListSchema(
      articles.slice(0, 20).map((article, index) => ({
        name: article.title,
        url: `${SITE_URL}/blog/${article.slug}`,
        position: index + 1,
        image: article.featuredImageUrl ?? null,
      })),
    ),
  ];

  return (
    <>
      <JsonLd schema={schemas} />

      <BlogHero
        eyebrow={`หมวด: ${category.name}`}
        title={`บทความ${category.name}`}
        description={category.description}
        breadcrumb={<Breadcrumb items={[...breadcrumbItems]} variant="light" />}
        stat={`พบ ${articles.length.toLocaleString("th-TH")} บทความ`}
      />

      <section className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
        <BlogCategoryChips
          activeSlug={category.slug}
          counts={counts}
          total={total}
        />

        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-8">
          <BlogCategorySidebar
            activeSlug={category.slug}
            counts={counts}
            total={total}
            className="hidden lg:flex"
          />

          <div>
            {articles.length === 0 ? (
              <EmptyState
                title="ยังไม่มีบทความในหมวดนี้"
                description={`กำลังเขียนบทความหมวด${category.name}อยู่ เร็ว ๆ นี้`}
                action={{ href: "/blog", label: "ดูบทความทั้งหมด" }}
              />
            ) : (
              <BlogSearch articles={articles} categoryLabel={category.name} />
            )}

            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">← กลับไปดูบทความทั้งหมด</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Single article view

function ArticleView({ article }: { article: MockArticle }) {
  const category = findCategory(article.category);
  const categoryName = category?.name ?? "บทความ";

  const tocItems = extractTocFromContent(article.content);
  const readTime = article.readTimeMinutes || estimateReadTime(article.content);
  const related = getRelatedArticles(article, 3);

  const publishedAt = article.publishedAt;
  const updatedAt = article.updatedAt ?? article.publishedAt;
  const isUpdated = updatedAt !== publishedAt;

  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "บทความ", url: "/blog" },
    { name: categoryName, url: `/blog/${article.category}` },
    { name: article.title, url: `/blog/${article.slug}` },
  ] as const;

  const schemas = [
    buildBreadcrumbSchema([...breadcrumbItems]),
    buildArticleSchema({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      featuredImageUrl: article.featuredImageUrl,
      category: categoryName,
      author: { id: article.id, name: article.authorName },
      publishedAt,
      updatedAt,
    }),
  ];

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;

  return (
    <>
      <JsonLd schema={schemas} />
      <BlogReadingProgress />

      {/* Hero / header */}
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1100px] px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-10">
          <Breadcrumb items={[...breadcrumbItems]} />
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/blog/${article.category}`}>
                <Badge className="bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]">
                  {categoryName}
                </Badge>
              </Link>
              <span className="text-xs text-[color:var(--color-muted)]">
                โดย{" "}
                <span className="font-semibold text-[color:var(--color-heading)]">
                  {article.authorName}
                </span>
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-[color:var(--color-heading)] md:text-[40px] md:leading-[1.15]">
              {article.title}
            </h1>

            <p className="max-w-3xl text-base leading-[1.8] text-[color:var(--color-body)] md:text-lg">
              {article.excerpt}
            </p>

            <ArticleMetaRow
              author={article.authorName}
              publishedAt={publishedAt}
              updatedAt={isUpdated ? updatedAt : undefined}
              readTime={readTime}
            />
          </div>
        </div>
      </header>

      {/* Featured image */}
      <figure className="mx-auto -mt-4 w-full max-w-[1100px] px-4 md:px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-light-bg)] shadow-sm">
          <Image
            src={article.featuredImageUrl}
            alt={article.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
        </div>
      </figure>

      {/* Body — article + sticky ToC */}
      <section className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-12">
          <div id="article-body" className="min-w-0">
            <TiptapRenderer
              content={article.content}
              afterFirstH2={<BlogInlineCta />}
            />

            {article.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <Tag
                  aria-hidden
                  className="size-4 text-[color:var(--color-muted)]"
                />
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-8">
              <BlogShareButtons title={article.title} url={articleUrl} />
            </div>

            <AuthorCard
              name={article.authorName}
              bio={article.authorBio}
              avatar={article.authorAvatar}
            />
          </div>

          <aside className="order-first lg:order-last">
            <div className="sticky top-24 flex flex-col gap-4">
              {tocItems.length >= 3 && <TableOfContents items={tocItems} />}
              <SidebarCta />
            </div>
          </aside>
        </div>
      </section>

      {/* Lead-gen band */}
      <section className="bg-[color:var(--color-light-bg)]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-4 py-12 text-center md:px-6 md:py-16">
          <h2 className="text-2xl font-bold leading-tight text-[color:var(--color-heading)] md:text-3xl">
            ต้องการให้เราแนะนำติวเตอร์ให้?
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            กรอกฟอร์ม 2 นาที ทีมงานจะคัดครูที่เหมาะกับคุณ 3-5 คน ภายใน 24 ชั่วโมง
            — ฟรี ไม่มีค่าใช้จ่าย
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[color:var(--color-cta)] font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
            >
              <Link href="/find-tutor">
                เริ่มหาครูสอนพิเศษ
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tutors">ดูติวเตอร์ทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-6 md:py-20">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                  อ่านต่อ
                </p>
                <h2 className="text-2xl font-bold leading-tight text-[color:var(--color-heading)] md:text-3xl">
                  บทความที่เกี่ยวข้อง
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
              >
                ดูบทความทั้งหมด
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard
                  key={item.slug}
                  article={{
                    slug: item.slug,
                    title: item.title,
                    excerpt: item.excerpt,
                    featuredImageUrl: item.featuredImageUrl,
                    category: findCategory(item.category)?.name ?? item.category,
                    publishedAt: item.publishedAt,
                    readTimeMinutes: item.readTimeMinutes,
                    imageAlt: item.imageAlt,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Helper components — kept colocated.

const THAI_DATE_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatThaiDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return THAI_DATE_FORMATTER.format(date);
}

function ArticleMetaRow({
  author,
  publishedAt,
  updatedAt,
  readTime,
}: {
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--color-muted)]">
      <span className="flex items-center gap-1.5">
        <User aria-hidden className="size-4" />
        <span className="font-medium text-[color:var(--color-heading)]">
          {author}
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <CalendarCheck2 aria-hidden className="size-4" />
        <time dateTime={publishedAt}>เผยแพร่ {formatThaiDate(publishedAt)}</time>
      </span>
      {updatedAt && (
        <span className="flex items-center gap-1.5 text-[color:var(--color-primary)]">
          <CalendarCheck2 aria-hidden className="size-4" />
          <time dateTime={updatedAt}>อัปเดตล่าสุด {formatThaiDate(updatedAt)}</time>
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Clock aria-hidden className="size-4" />
        อ่าน {readTime} นาที
      </span>
    </div>
  );
}

function AuthorCard({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio: string;
  avatar?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="mt-10 flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[color:var(--color-light-bg)]">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base font-bold text-[color:var(--color-primary)]">
            {initials || "BT"}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
          เกี่ยวกับผู้เขียน
        </p>
        <p className="mt-1 text-base font-semibold text-[color:var(--color-heading)]">
          {name}
        </p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--color-body)]">
          {bio}
        </p>
      </div>
    </aside>
  );
}

function SidebarCta() {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-primary)]/15 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] p-5 text-white shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
        ค้นหาติวเตอร์
      </p>
      <h3 className="mt-1 text-lg font-bold leading-snug">
        ติวเตอร์คุณภาพ 500+ คน
      </h3>
      <p className="mt-1 text-xs leading-5 text-white/90">
        จับคู่ครูที่เหมาะกับคุณภายใน 24 ชม. ฟรี ไม่มีค่าใช้จ่าย
      </p>
      <Button
        asChild
        size="sm"
        className="mt-3 w-full bg-[color:var(--color-cta)] font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
      >
        <Link href="/find-tutor">
          หาครูสอนพิเศษ
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
      <div className="mt-3 flex flex-col gap-2 text-xs">
        <a
          href={CONTACT_INFO.phoneHref}
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 font-medium text-white transition-colors hover:bg-white/20"
        >
          <Phone className="size-3.5" />
          โทร {CONTACT_INFO.phone}
        </a>
        <a
          href={CONTACT_INFO.lineHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 font-medium text-white transition-colors hover:bg-white/20"
        >
          LINE OA {CONTACT_INFO.lineId}
        </a>
      </div>
    </div>
  );
}

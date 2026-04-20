import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site-metadata";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type SitemapEntry = MetadataRoute.Sitemap[number];

// ---------------------------------------------------------------------------
// Static pages — high priority conversion + SEO landing pages.
// ---------------------------------------------------------------------------

const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/tutors", changeFrequency: "daily", priority: 0.9 },
  { path: "/find-tutor", changeFrequency: "weekly", priority: 0.95 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/join-with-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tutor-register", changeFrequency: "monthly", priority: 0.7 },
  { path: "/review", changeFrequency: "weekly", priority: 0.6 },
];

// ---------------------------------------------------------------------------
// Prisma loader — deferred so sitemap.ts builds before the client is
// generated. When `@/lib/prisma` is not yet exported we return an empty
// placeholder that produces no dynamic entries. Lead is notified via the
// SEO teammate report that this loader needs to be revisited once the
// Backend Dev teammate lands the Prisma client.
// ---------------------------------------------------------------------------

type PrismaDelegate = {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
};

type PrismaLike = {
  tutor?: PrismaDelegate;
  article?: PrismaDelegate;
  subjectCategory?: PrismaDelegate;
  subject?: PrismaDelegate;
};

async function loadPrisma(): Promise<PrismaLike | null> {
  try {
    // Dynamic import so missing module during early phases does not break
    // `next build`. Once `src/lib/prisma/index.ts` exports `prisma`, this
    // will pick it up without further changes.
    const mod: unknown = await import("@/lib/prisma").catch(() => null);
    if (!mod || typeof mod !== "object") return null;
    const candidate = (mod as { prisma?: unknown }).prisma;
    if (!candidate || typeof candidate !== "object") return null;
    return candidate as PrismaLike;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Dynamic entry fetchers. Each wraps its own try/catch so a failure in one
// table doesn't blank the entire sitemap.
// ---------------------------------------------------------------------------

interface TutorRow {
  slug: string;
  updatedAt?: Date | string | null;
}

async function getTutorEntries(prisma: PrismaLike): Promise<SitemapEntry[]> {
  if (!prisma.tutor) return [];
  try {
    const rows = (await prisma.tutor.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    })) as TutorRow[];

    return rows
      .filter((row): row is TutorRow => typeof row?.slug === "string")
      .map((row) => ({
        url: `${SITE_URL}/tutor/${row.slug}`,
        lastModified: toDate(row.updatedAt) ?? new Date(),
        changeFrequency: "weekly" as ChangeFrequency,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

interface ArticleRow {
  slug: string;
  updatedAt?: Date | string | null;
  publishedAt?: Date | string | null;
}

async function getArticleEntries(prisma: PrismaLike): Promise<SitemapEntry[]> {
  if (!prisma.article) return [];
  try {
    const rows = (await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
    })) as ArticleRow[];

    return rows
      .filter((row): row is ArticleRow => typeof row?.slug === "string")
      .map((row) => ({
        url: `${SITE_URL}/blog/${row.slug}`,
        lastModified:
          toDate(row.updatedAt) ?? toDate(row.publishedAt) ?? new Date(),
        changeFrequency: "monthly" as ChangeFrequency,
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}

interface SubjectCategoryRow {
  slug: string;
  updatedAt?: Date | string | null;
  subjects?: Array<{ slug: string; updatedAt?: Date | string | null }>;
}

async function getSubjectEntries(prisma: PrismaLike): Promise<SitemapEntry[]> {
  if (!prisma.subjectCategory) return [];
  try {
    const categories = (await prisma.subjectCategory.findMany({
      select: {
        slug: true,
        updatedAt: true,
        subjects: { select: { slug: true, updatedAt: true } },
      },
    })) as SubjectCategoryRow[];

    const entries: SitemapEntry[] = [];

    for (const cat of categories) {
      if (typeof cat?.slug !== "string") continue;

      entries.push({
        url: `${SITE_URL}/subject/${cat.slug}`,
        lastModified: toDate(cat.updatedAt) ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      for (const sub of cat.subjects ?? []) {
        if (typeof sub?.slug !== "string") continue;
        entries.push({
          url: `${SITE_URL}/subject/${cat.slug}/${sub.slug}`,
          lastModified: toDate(sub.updatedAt) ?? toDate(cat.updatedAt) ?? new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    return entries;
  } catch {
    return [];
  }
}

function toDate(value: Date | string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// ---------------------------------------------------------------------------
// Main sitemap handler.
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}` || SITE_URL,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const prisma = await loadPrisma();
  if (!prisma) {
    return staticEntries;
  }

  const [tutorEntries, articleEntries, subjectEntries] = await Promise.all([
    getTutorEntries(prisma),
    getArticleEntries(prisma),
    getSubjectEntries(prisma),
  ]);

  return [
    ...staticEntries,
    ...subjectEntries,
    ...tutorEntries,
    ...articleEntries,
  ];
}

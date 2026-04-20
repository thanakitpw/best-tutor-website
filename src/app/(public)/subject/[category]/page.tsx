import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { SubjectCard } from "@/components/public/subject-card";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  SUBJECT_CATEGORIES,
  buildListingTutorPool,
  findCategory,
  getTutorsForCategory,
  PROVINCE_OPTIONS,
} from "../_data";
import { TutorListing } from "../_components/tutor-listing";
import { TutorListingSkeleton } from "../_components/tutor-listing-skeleton";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Next 15: static params enable ISR-friendly prerender of all category pages.
export async function generateStaticParams() {
  return SUBJECT_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(slug);
  if (!category) {
    return buildMetadata({
      title: "ไม่พบหมวดวิชา | Best Tutor Thailand",
      description: "หมวดวิชานี้ไม่มีอยู่ในระบบ",
      path: `/subject/${slug}`,
      noIndex: true,
    });
  }

  const pool = buildListingTutorPool();
  const matched = getTutorsForCategory(category, pool);
  const tutorCount = matched.length;

  const title = `${category.seoHeadline} | Best Tutor Thailand`;
  const description = `${category.seoBlurb} มีติวเตอร์ ${tutorCount.toLocaleString("th-TH")} คนพร้อมสอน`;

  return buildMetadata({
    title,
    description,
    path: `/subject/${category.slug}`,
    keywords: category.seoKeywords,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const pool = buildListingTutorPool();
  const tutors = getTutorsForCategory(category, pool);

  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "รายวิชาที่เปิดสอน", url: "/tutors" },
    { name: category.name, url: `/subject/${category.slug}` },
  ] as const;

  const schemas = [
    buildBreadcrumbSchema([...breadcrumbItems]),
    // ItemList of tutors for Google rich results.
    buildItemListSchema(
      tutors.map((t, i) => ({
        name: `${t.nickname} ${t.firstName}${t.lastName ? ` ${t.lastName}` : ""}`,
        url: `/tutor/${t.slug}`,
        position: i + 1,
      })),
    ),
  ];

  return (
    <>
      <JsonLd schema={schemas} />

      {/* Hero banner */}
      <section
        aria-label={`ติวเตอร์${category.name}`}
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-12 md:px-6 md:py-16">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "รายวิชาที่เปิดสอน", href: "/tutors" },
              { name: category.name },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white hover:bg-white/20"
            >
              <BookOpen className="size-3.5" />
              {category.subs.length > 0
                ? `${category.subs.length} วิชาย่อย`
                : "หมวดวิชาหลัก"}
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {category.seoHeadline}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/85 md:text-base">
              {category.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                ติวเตอร์ {tutors.length.toLocaleString("th-TH")} คน
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-4" aria-hidden />
                สอนทั้งที่บ้านและออนไลน์
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-subject cards */}
      {category.subs.length > 0 && (
        <section
          aria-label={`วิชาย่อยใน${category.name}`}
          className="border-b border-[color:var(--color-border)] bg-white"
        >
          <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
                  เลือกวิชาย่อย
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  กรองติวเตอร์ตามวิชาเฉพาะที่คุณต้องการ
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {category.subs.map((sub) => (
                <SubjectCard
                  key={sub.slug}
                  subject={{
                    slug: sub.slug,
                    name: sub.name,
                    iconName: category.iconName,
                  }}
                  href={`/subject/${category.slug}/${sub.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter + grid */}
      <section aria-label={`ติวเตอร์${category.name}`} className="bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
              ติวเตอร์{category.name}ทั้งหมด
            </h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              กรองตามช่วงราคา ประสบการณ์ คะแนนรีวิว และพื้นที่ที่สะดวก
            </p>
          </div>
          {/* Suspense boundary required because <TutorListing> calls
              useSearchParams() — Next.js needs this to keep the surrounding
              shell statically rendered while the client hydrates. */}
          <Suspense fallback={<TutorListingSkeleton />}>
            <TutorListing
              tutors={tutors}
              provinceOptions={PROVINCE_OPTIONS}
            />
          </Suspense>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="หาครูที่ใช่" className="bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-6 md:py-14">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-light-bg)] p-8 text-center md:flex-row md:text-left">
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
                ยังหาติวเตอร์{category.name}ที่ใช่ไม่เจอ?
              </h2>
              <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                กรอกฟอร์มบอกความต้องการ ทีมงานจะจับคู่ติวเตอร์ให้ภายใน 24 ชั่วโมง
              </p>
            </div>
            <Link
              href="/find-tutor"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--color-cta)] px-6 text-sm font-semibold text-[color:var(--color-heading)] shadow-sm transition-colors hover:bg-[color:var(--color-cta-hover)]"
            >
              กรอกฟอร์มหาครู
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

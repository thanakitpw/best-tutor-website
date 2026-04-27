import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  SUBJECT_CATEGORIES,
  findCategory,
  findSubSubject,
  PROVINCE_OPTIONS,
} from "../../_data";
import { getListingTutorsForSubject } from "@/lib/tutors/public";
import { TutorListing } from "../../_components/tutor-listing";
import { TutorListingSkeleton } from "../../_components/tutor-listing-skeleton";

interface SubSubjectPageProps {
  params: Promise<{ category: string; sub: string }>;
}

export async function generateStaticParams() {
  const out: { category: string; sub: string }[] = [];
  for (const cat of SUBJECT_CATEGORIES) {
    for (const sub of cat.subs) {
      out.push({ category: cat.slug, sub: sub.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: SubSubjectPageProps): Promise<Metadata> {
  const { category: categorySlug, sub: subSlug } = await params;
  const category = findCategory(categorySlug);
  if (!category) {
    return buildMetadata({
      title: "ไม่พบหมวดวิชา | Best Tutor Thailand",
      description: "หมวดวิชานี้ไม่มีอยู่ในระบบ",
      path: `/subject/${categorySlug}/${subSlug}`,
      noIndex: true,
    });
  }
  const sub = findSubSubject(category, subSlug);
  if (!sub) {
    return buildMetadata({
      title: "ไม่พบวิชา | Best Tutor Thailand",
      description: "วิชานี้ไม่มีอยู่ในระบบ",
      path: `/subject/${categorySlug}/${subSlug}`,
      noIndex: true,
    });
  }

  const tutors = await getListingTutorsForSubject(sub.slug);

  const title = `ติวเตอร์${sub.name} สอนพิเศษตัวต่อตัว | Best Tutor Thailand`;
  const description = `รวมติวเตอร์${sub.name}คุณภาพสูง สอนพิเศษตัวต่อตัว ทั้งที่บ้านและออนไลน์ มีติวเตอร์ให้เลือก ${tutors.length.toLocaleString("th-TH")} คน กรองตามประสบการณ์ ราคา และพื้นที่`;

  return buildMetadata({
    title,
    description,
    path: `/subject/${category.slug}/${sub.slug}`,
    keywords: [
      `ติวเตอร์${sub.name}`,
      `สอนพิเศษ${sub.name}`,
      `ครู${sub.name}ตัวต่อตัว`,
      `เรียน${sub.name}ออนไลน์`,
      ...category.seoKeywords.slice(0, 3),
    ],
  });
}

export default async function SubSubjectPage({ params }: SubSubjectPageProps) {
  const { category: categorySlug, sub: subSlug } = await params;
  const category = findCategory(categorySlug);
  if (!category) notFound();
  const sub = findSubSubject(category, subSlug);
  if (!sub) notFound();

  const tutors = await getListingTutorsForSubject(sub.slug);

  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "รายวิชาที่เปิดสอน", url: "/tutors" },
    { name: category.name, url: `/subject/${category.slug}` },
    { name: sub.name, url: `/subject/${category.slug}/${sub.slug}` },
  ] as const;

  const schemas = [
    buildBreadcrumbSchema([...breadcrumbItems]),
    buildItemListSchema(
      tutors.map((t, i) => ({
        name: `${t.nickname} ${t.firstName}${t.lastName ? ` ${t.lastName}` : ""}`,
        url: `/tutor/${t.slug}`,
        position: i + 1,
      })),
    ),
  ];

  // Sibling sub-subjects for easy pivoting.
  const siblings = category.subs.filter((s) => s.slug !== sub.slug);

  return (
    <>
      <JsonLd schema={schemas} />

      {/* Hero */}
      <section
        aria-label={`ติวเตอร์${sub.name}`}
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-12 md:px-6 md:py-16">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "รายวิชาที่เปิดสอน", href: "/tutors" },
              { name: category.name, href: `/subject/${category.slug}` },
              { name: sub.name },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white hover:bg-white/20"
            >
              <Sparkles className="size-3.5" />
              วิชาย่อยใน {category.name}
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              ติวเตอร์{sub.name} สอนพิเศษตัวต่อตัว
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white md:text-base">
              รวมครูสอนพิเศษ{sub.name}ที่ผ่านการคัดกรองคุณภาพ พร้อมสอนทั้งที่บ้านและออนไลน์
              เลือกติวเตอร์ที่เหมาะกับระดับชั้นและเป้าหมายของคุณ
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white">
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

      {/* Sibling subs — pivot nav */}
      {siblings.length > 0 && (
        <nav
          aria-label={`วิชาย่อยอื่นใน${category.name}`}
          className="border-b border-[color:var(--color-border)] bg-white"
        >
          <div className="mx-auto flex w-full max-w-[1240px] items-center gap-3 overflow-x-auto px-4 py-3 md:px-6">
            <span className="shrink-0 text-xs font-medium text-[color:var(--color-muted)]">
              วิชาอื่นใน {category.name}:
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/subject/${category.slug}`}
                className="whitespace-nowrap rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-medium text-[color:var(--color-muted)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                ทั้งหมด
              </Link>
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/subject/${category.slug}/${s.slug}`}
                  className="whitespace-nowrap rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-medium text-[color:var(--color-body)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Filter + grid */}
      <section aria-label={`รายชื่อติวเตอร์${sub.name}`} className="bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
              รายชื่อติวเตอร์{sub.name}
            </h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              กรองตามช่วงราคา ประสบการณ์ คะแนนรีวิว และพื้นที่ที่สะดวก
            </p>
          </div>
          {/* Suspense boundary required — see /subject/[category]/page.tsx */}
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
                ให้เราช่วยจับคู่ครู{sub.name}ที่เหมาะกับคุณ
              </h2>
              <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                แจ้งเป้าหมาย ระดับชั้น และพื้นที่ — ทีมงานจับคู่ติวเตอร์ให้ภายใน 24 ชั่วโมง
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

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { MOCK_ALL_CATEGORIES } from "@/components/public/mock-data";
import { SubjectCard } from "@/components/public/subject-card";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/tutors";
const PAGE_TITLE = "รายวิชาที่เปิดสอน ติวเตอร์ทุกวิชา | Best Tutor Thailand";
const PAGE_DESCRIPTION =
  "รวมติวเตอร์คุณภาพครอบคลุมทุกหมวดวิชา ภาษาต่างประเทศ คณิตศาสตร์ วิทยาศาสตร์ ภาษาไทย สังคม คอมพิวเตอร์ ศิลปะ ดนตรี กีฬา เลือกเรียนที่บ้านหรือออนไลน์";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "รายวิชาที่เปิดสอน",
    "วิชาติวเตอร์",
    "ครูสอนพิเศษทุกวิชา",
    "ติวเตอร์ภาษาอังกฤษ",
    "ติวเตอร์คณิตศาสตร์",
    "ติวเตอร์วิทยาศาสตร์",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "หน้าแรก", url: "/" },
  { name: "รายวิชาที่เปิดสอน", url: PAGE_PATH },
] as const;

export default function TutorsPage() {
  const itemListSchema = buildItemListSchema(
    MOCK_ALL_CATEGORIES.map((subject, index) => ({
      name: subject.name,
      url: `/subject/${subject.slug}`,
      position: index + 1,
    })),
  );
  const breadcrumbSchema = buildBreadcrumbSchema([...BREADCRUMB_ITEMS]);

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, itemListSchema]} />

      {/* Hero banner — slimmer than homepage, informative headline */}
      <section
        aria-label="หมวดวิชา"
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-12 md:px-6 md:py-16">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "รายวิชาที่เปิดสอน" },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white hover:bg-white/20"
            >
              <BookOpen className="size-3.5" />
              {MOCK_ALL_CATEGORIES.length} หมวดวิชาหลัก
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              รายวิชาที่เปิดสอน
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/85 md:text-base">
              เลือกหมวดวิชาที่คุณสนใจ เรามีติวเตอร์คุณภาพพร้อมสอนครอบคลุมทุกระดับ
              ตั้งแต่ประถมศึกษาจนถึงเตรียมสอบเข้ามหาวิทยาลัย
            </p>
          </div>
        </div>
      </section>

      {/* Subject grid */}
      <section aria-label="หมวดวิชาทั้งหมด" className="bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-6 md:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_ALL_CATEGORIES.map((subject) => (
              <SubjectCard key={subject.slug} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-action band */}
      <section aria-label="หาครูที่ใช่" className="bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-6 md:py-16">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-8 text-center shadow-sm md:flex-row md:text-left">
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl">
                ไม่พบวิชาที่ต้องการ? ให้เราช่วยคุณ
              </h2>
              <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                กรอกฟอร์มบอกความต้องการของคุณ ทีมงานจะจับคู่ติวเตอร์ให้ภายใน 24 ชม.
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

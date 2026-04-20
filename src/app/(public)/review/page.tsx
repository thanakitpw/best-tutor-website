import type { Metadata } from "next";
import { PenLine, ShieldCheck, Sparkles } from "lucide-react";

import { Breadcrumb } from "@/components/public/breadcrumb";
import { ReviewForm } from "@/components/public/review-form";
import { MOCK_FEATURED_TUTORS } from "@/components/public/mock-data";
import { JsonLd } from "@/lib/seo/json-ld-script";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/review";
const PAGE_TITLE = "เขียนรีวิวติวเตอร์ | Best Tutor Thailand";
const PAGE_DESCRIPTION =
  "แชร์ประสบการณ์เรียนกับติวเตอร์ของคุณ ช่วยให้ผู้ปกครองคนอื่นตัดสินใจได้ง่ายขึ้น";

/**
 * Form pages should not be indexed — per SEO-First Rules. We still surface
 * OG metadata so LINE / Facebook share previews look clean.
 */
export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  noIndex: true,
});

const BREADCRUMB_ITEMS = [
  { name: "หน้าแรก", url: "/" },
  { name: "เขียนรีวิว", url: PAGE_PATH },
] as const;

interface ReviewPageProps {
  // Next.js 16 App Router passes searchParams as a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * `/review` — public review submission page.
 *
 * Phase 3.5 built the display side (TutorReviews) on tutor profiles;
 * this page is the *submit* side. Reviews start hidden and require admin
 * approval (see POST /api/reviews).
 *
 * `?tutor=<slug>` pre-selects a tutor, so the tutor profile CTA can deep-link
 * users here with context already set.
 */
export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = (await searchParams) ?? {};
  const rawTutor = params.tutor;
  const prefillSlug = Array.isArray(rawTutor) ? rawTutor[0] : rawTutor;

  const breadcrumbSchema = buildBreadcrumbSchema([...BREADCRUMB_ITEMS]);

  // TODO(phase-8): replace MOCK_FEATURED_TUTORS with a Prisma query returning
  //   approved tutors (slug, nickname, firstName, subjects). Keep the shape
  //   identical so the combobox doesn't need changes.
  const tutors = MOCK_FEATURED_TUTORS;

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero — smaller than homepage. The form is the product here. */}
      <section
        aria-label="เขียนรีวิว"
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "เขียนรีวิว" },
            ]}
          />
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
              <Sparkles className="size-3.5" />
              ช่วยทีมเราเติบโต
            </span>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              เขียนรีวิว
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              แชร์ประสบการณ์เรียนกับติวเตอร์ของเรา
              รีวิวของคุณช่วยให้ผู้ปกครองคนอื่นตัดสินใจได้ง่ายขึ้น
            </p>
          </div>
        </div>
      </section>

      {/* Form card — centered on desktop, full-bleed-ish on mobile */}
      <section
        aria-label="แบบฟอร์มเขียนรีวิว"
        className="bg-[color:var(--color-alt-bg)]"
      >
        <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6 md:py-14">
          {/* Moderation notice */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-sm md:p-5">
            <span
              aria-hidden
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-light-bg)]"
            >
              <ShieldCheck className="size-5 text-[color:var(--color-primary)]" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                รีวิวของคุณจะถูกตรวจสอบก่อนเผยแพร่
              </p>
              <p className="text-xs leading-5 text-[color:var(--color-muted)]">
                ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง
                เพื่อให้มั่นใจว่าเนื้อหาตรงตามนโยบายและเป็นประโยชน์กับผู้อ่าน
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm md:p-8">
            <div className="mb-6 flex items-start gap-3">
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-cta)]/20"
              >
                <PenLine className="size-5 text-[color:var(--color-heading)]" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
                  เล่าประสบการณ์ของคุณ
                </h2>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                  ใช้เวลาไม่ถึง 2 นาที — ช่วยให้ติวเตอร์ที่คุณชอบได้รับความไว้วางใจเพิ่มขึ้น
                </p>
              </div>
            </div>

            <ReviewForm tutors={tutors} prefillTutorSlug={prefillSlug} />
          </div>
        </div>
      </section>
    </>
  );
}

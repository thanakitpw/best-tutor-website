import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Home } from "lucide-react";

import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/review/success";
const PAGE_TITLE = "ขอบคุณสำหรับรีวิว — รอการตรวจสอบ";
const PAGE_DESCRIPTION =
  "ขอบคุณที่ช่วยแชร์ประสบการณ์ รีวิวของคุณจะถูกตรวจสอบก่อนเผยแพร่ภายใน 24 ชั่วโมง";

// Success pages should never be indexed (accessing without submitting shouldn't
// yield a useful SERP result).
export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  noIndex: true,
});

interface ReviewSuccessPageProps {
  // Next.js 16 App Router passes searchParams as a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Post-submit confirmation for `/review`. The `?tutor=<slug>` query param
 * (set by ReviewForm on success) lets us deep-link the user back to the
 * tutor they just reviewed — useful for share-and-review loops.
 */
export default async function ReviewSuccessPage({
  searchParams,
}: ReviewSuccessPageProps) {
  const params = (await searchParams) ?? {};
  const rawTutor = params.tutor;
  const tutorSlug = Array.isArray(rawTutor) ? rawTutor[0] : rawTutor;

  return (
    <section
      aria-label="ส่งรีวิวเรียบร้อย"
      className="bg-[color:var(--color-alt-bg)]"
    >
      <div className="mx-auto w-full max-w-[720px] px-4 py-14 md:py-20">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[color:var(--color-success)]/10 md:size-20">
            <CheckCircle2 className="size-10 text-[color:var(--color-success)] md:size-12" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
            ขอบคุณสำหรับรีวิว
          </h1>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            รีวิวของคุณจะถูกตรวจสอบก่อนเผยแพร่ภายใน{" "}
            <span className="font-semibold text-[color:var(--color-primary)]">
              24 ชั่วโมง
            </span>{" "}
            ขอบคุณที่ช่วยทำให้ Best Tutor เติบโต
          </p>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-light-bg)] px-4 py-2 text-xs font-medium text-[color:var(--color-primary)]">
            <Clock3 className="size-3.5" />
            ทีมงานจะแจ้งเมื่อรีวิวได้รับการเผยแพร่
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            {tutorSlug ? (
              <Link
                href={`/tutor/${encodeURIComponent(tutorSlug)}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-primary-hover)]"
              >
                กลับหน้าโปรไฟล์ติวเตอร์
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-6 text-sm font-semibold text-[color:var(--color-body)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              <Home className="size-4" />
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Users2,
} from "lucide-react";

import { CONTACT_INFO } from "@/components/public/mock-data";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/find-tutor/success";
const PAGE_TITLE = "ส่งคำขอเรียบร้อย — ทีมจะติดต่อกลับใน 24 ชม.";
const PAGE_DESCRIPTION =
  "คำขอหาติวเตอร์ของคุณถูกส่งถึงทีมงาน Best Tutor Thailand แล้ว ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง";

// noIndex — success pages should not be crawled (also prevents accidental
// access without a real lead id).
export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  noIndex: true,
});

/**
 * Post-submit confirmation screen for `/find-tutor`.
 *
 * Deliberately keeps the lead id in the URL so support staff can reference
 * it if a visitor calls in immediately; we do not display the raw id
 * (would look like noise).
 */
export default function FindTutorSuccessPage() {
  return (
    <section aria-label="ส่งคำขอเรียบร้อย" className="bg-[color:var(--color-alt-bg)]">
      <div className="mx-auto w-full max-w-[860px] px-4 py-14 md:py-20">
        {/* Hero confirmation card */}
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[color:var(--color-success)]/10 md:size-20">
            <CheckCircle2 className="size-10 text-[color:var(--color-success)] md:size-12" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
            ส่งคำขอเรียบร้อย
          </h1>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            ทีม Best Tutor Thailand จะติดต่อกลับภายใน{" "}
            <span className="font-semibold text-[color:var(--color-primary)]">
              24 ชั่วโมง
            </span>{" "}
            เพื่อแนะนำติวเตอร์ที่เหมาะที่สุดสำหรับคุณ
          </p>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-light-bg)] px-4 py-2 text-xs font-medium text-[color:var(--color-primary)]">
            <Sparkles className="size-3.5" />
            ทดลองเรียนครั้งแรก ฟรี 1 ชั่วโมง
          </div>
        </div>

        {/* Next-steps cards */}
        <div className="mt-8">
          <h2 className="text-center text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
            ขั้นตอนถัดไป
          </h2>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            <StepCard
              number={1}
              icon={<PhoneCall className="size-5" />}
              title="ทีมงานโทรหาคุณ"
              body="พูดคุยเพื่อเข้าใจเป้าหมาย ระดับชั้น และงบที่ต้องการ"
            />
            <StepCard
              number={2}
              icon={<Users2 className="size-5" />}
              title="เราจับคู่ติวเตอร์"
              body="คัดเลือกติวเตอร์ 2-3 คนที่เหมาะ ส่งโปรไฟล์ให้ดู"
            />
            <StepCard
              number={3}
              icon={<Sparkles className="size-5" />}
              title="เริ่มเรียนทดลอง"
              body="ทดลองเรียนชั่วโมงแรกฟรี ถ้าไม่พอใจเปลี่ยนติวเตอร์ได้"
            />
          </ol>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-primary-hover)]"
          >
            กลับหน้าแรก
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={CONTACT_INFO.lineHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--color-success)]/40 bg-white px-6 text-sm font-semibold text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10"
          >
            <MessageCircle className="size-4" />
            ทัก LINE {CONTACT_INFO.lineId}
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--color-muted)]">
          ต้องการคุยด่วน? โทร{" "}
          <a
            href={CONTACT_INFO.phoneHref}
            className="font-semibold text-[color:var(--color-primary)] hover:underline"
          >
            {CONTACT_INFO.phone}
          </a>{" "}
          ({CONTACT_INFO.workDays})
        </p>
      </div>
    </section>
  );
}

function StepCard({
  number,
  icon,
  title,
  body,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="relative rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[color:var(--color-primary)]">
        <span
          aria-hidden
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-light-bg)] text-sm font-bold"
        >
          {number}
        </span>
        <span aria-hidden>{icon}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-[color:var(--color-heading)]">
        {title}
      </p>
      <p className="mt-1 text-xs leading-5 text-[color:var(--color-muted)]">
        {body}
      </p>
    </li>
  );
}

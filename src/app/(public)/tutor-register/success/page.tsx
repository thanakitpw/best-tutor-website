import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  MessageCircle,
  Rocket,
  Users2,
} from "lucide-react";

import { CONTACT_INFO } from "@/components/public/mock-data";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/tutor-register/success";
const PAGE_TITLE = "ส่งใบสมัครเรียบร้อย — ทีมจะติดต่อกลับใน 48 ชม.";
const PAGE_DESCRIPTION =
  "ใบสมัครเป็นติวเตอร์ของคุณถูกส่งถึงทีมงาน Best Tutor Thailand แล้ว ทีมงานจะตรวจสอบและติดต่อกลับภายใน 48 ชั่วโมง";

// noIndex — registration confirmation should not be crawled.
export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  noIndex: true,
});

/**
 * Post-submit confirmation for `/tutor-register`.
 * Mirrors the `/find-tutor/success` layout + copy for consistency.
 */
export default function TutorRegisterSuccessPage() {
  return (
    <section
      aria-label="ส่งใบสมัครเรียบร้อย"
      className="bg-[color:var(--color-alt-bg)]"
    >
      <div className="mx-auto w-full max-w-[860px] px-4 py-14 md:py-20">
        {/* Hero confirmation card */}
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[color:var(--color-success)]/10 md:size-20">
            <CheckCircle2 className="size-10 text-[color:var(--color-success)] md:size-12" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
            ส่งใบสมัครเรียบร้อย
          </h1>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            ทีม Best Tutor Thailand จะตรวจสอบและติดต่อกลับภายใน{" "}
            <span className="font-semibold text-[color:var(--color-primary)]">
              48 ชั่วโมง
            </span>{" "}
            หากมีข้อสงสัย ติดต่อผ่าน LINE {CONTACT_INFO.lineId} ได้ตลอด
          </p>
        </div>

        {/* Next-steps cards */}
        <div className="mt-8">
          <h2 className="text-center text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
            ขั้นตอนถัดไป
          </h2>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            <StepCard
              number={1}
              icon={<FileCheck2 className="size-5" />}
              title="ทีมตรวจเอกสาร"
              body="เจ้าหน้าที่จะตรวจสอบข้อมูลและเอกสารที่คุณส่งมา — หากยังไม่ได้แนบ จะขอเพิ่มทาง LINE"
            />
            <StepCard
              number={2}
              icon={<Users2 className="size-5" />}
              title="ยืนยันและอนุมัติ"
              body="สัมภาษณ์สั้นๆ ทางโทรศัพท์หรือวิดีโอคอล เพื่อเข้าใจสไตล์การสอนและยืนยันตัวตน"
            />
            <StepCard
              number={3}
              icon={<Rocket className="size-5" />}
              title="เริ่มรับงานสอน"
              body="โปรไฟล์เผยแพร่ทันทีเมื่ออนุมัติ เริ่มได้รับแจ้งเตือนงานที่เหมาะกับคุณ"
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
          ต้องการสอบถามด่วน? โทร{" "}
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

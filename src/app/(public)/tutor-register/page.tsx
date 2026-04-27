import type { Metadata } from "next";
import { BadgeCheck, Clock3, HeartHandshake, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { TutorRegisterForm } from "@/components/public/tutor-register-form";
import { JsonLd } from "@/lib/seo/json-ld-script";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/tutor-register";
const PAGE_TITLE =
  "ลงทะเบียนสมัครเป็นติวเตอร์ — กรอก 3 ขั้นตอน | Best Tutor Thailand";
const PAGE_DESCRIPTION =
  "ลงทะเบียนสมัครเป็นติวเตอร์ ฟรี กรอกข้อมูลเพียง 3 ขั้นตอน ทีมงานตรวจสอบและติดต่อกลับภายใน 48 ชั่วโมง";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "ลงทะเบียนติวเตอร์",
    "สมัครเป็นติวเตอร์",
    "ฟอร์มสมัครสอนพิเศษ",
    "หางานติวเตอร์",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "หน้าแรก", url: "/" },
  { name: "สมัครเป็นติวเตอร์", url: "/join-with-us" },
  { name: "ลงทะเบียน", url: PAGE_PATH },
] as const;

/**
 * /tutor-register — public 3-step application form.
 *
 * Server Component wrapper so we can emit metadata + breadcrumb JSON-LD.
 * Form state lives in the client `<TutorRegisterForm>`.
 */
export default function TutorRegisterPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([...BREADCRUMB_ITEMS]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero */}
      <section
        aria-label="ลงทะเบียนสมัครเป็นติวเตอร์"
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "สมัครเป็นติวเตอร์", href: "/join-with-us" },
              { name: "ลงทะเบียน" },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white hover:bg-white/20"
            >
              <Sparkles className="size-3.5" />
              ใช้เวลา ~5 นาที
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              ลงทะเบียนสมัครเป็นติวเตอร์
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              กรอกข้อมูลด้านล่าง ทีมงานจะตรวจสอบและติดต่อกลับภายใน 48 ชั่วโมง
            </p>
          </div>
        </div>
      </section>

      {/* Main split — value panel + form */}
      <section
        aria-label="ฟอร์มสมัครเป็นติวเตอร์"
        className="bg-[color:var(--color-alt-bg)]"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
            <aside
              aria-label="ข้อดีของการสมัคร"
              className="order-1 h-fit rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm md:p-7"
            >
              <h2 className="text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
                ก่อนเริ่มกรอกฟอร์ม
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                ใช้เวลาประมาณ 5 นาที เตรียมเอกสารไว้ในเครื่อง (ถ้ามี) เพื่อแนบได้ทันที
              </p>

              <ul className="mt-5 space-y-4">
                <ValueProp
                  icon={
                    <HeartHandshake className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="ฟรี ไม่มีค่าสมัคร"
                  body="สมัครได้ฟรี ไม่มีค่าใช้จ่ายล่วงหน้า ไม่มีค่าแรกเข้า"
                />
                <ValueProp
                  icon={
                    <BadgeCheck className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="ข้อมูลปลอดภัย"
                  body="ข้อมูลส่วนตัวถูกเก็บอย่างเป็นความลับ ใช้เฉพาะการจับคู่นักเรียน"
                />
                <ValueProp
                  icon={
                    <Clock3 className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="อนุมัติภายใน 48 ชั่วโมง"
                  body="ทีมงานตรวจสอบและติดต่อกลับทางโทรศัพท์หรือ LINE"
                />
              </ul>

              <div className="mt-6 rounded-xl bg-[color:var(--color-light-bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  เตรียมพร้อม
                </p>
                <ul className="mt-2 space-y-1.5 text-xs leading-6 text-[color:var(--color-body)]">
                  <li>• เบอร์โทร + LINE ที่ติดต่อได้</li>
                  <li>• วุฒิการศึกษาหรือประวัติคร่าวๆ</li>
                  <li>• วิชาที่ต้องการสอน</li>
                  <li>• สำเนาบัตรประชาชน / วุฒิ (ส่งภายหลังได้)</li>
                </ul>
              </div>
            </aside>

            <div className="order-2 min-w-0">
              <TutorRegisterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueProp({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-light-bg)]"
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-[color:var(--color-heading)]">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-[color:var(--color-muted)]">
          {body}
        </p>
      </div>
    </li>
  );
}

import type { Metadata } from "next";
import {
  BadgeCheck,
  Clock3,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/public/breadcrumb";
import { FindTutorForm } from "@/components/public/find-tutor-form";
import {
  resolveAgeGroupFromQuery,
  resolveCategorySlugFromQuery,
  resolveProvinceFromQuery,
} from "@/components/public/find-tutor-options";
import { JsonLd } from "@/lib/seo/json-ld-script";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/find-tutor";
const PAGE_TITLE =
  "หาติวเตอร์ สอนพิเศษตัวต่อตัว ฟรี — ทีมจับคู่ใน 24 ชม. | Best Tutor Thailand";
const PAGE_DESCRIPTION =
  "กรอกฟอร์มฟรี ทีมงานจับคู่ติวเตอร์คุณภาพให้คุณภายใน 24 ชั่วโมง ทดลองเรียนฟรี 1 ชั่วโมง — เรียนได้ทั้งที่บ้านและออนไลน์";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "หาติวเตอร์",
    "หาครูสอนพิเศษ",
    "ฟอร์มหาติวเตอร์",
    "จับคู่ติวเตอร์",
    "ติวเตอร์ตัวต่อตัว",
    "ทดลองเรียนฟรี",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "หน้าแรก", url: "/" },
  { name: "หาครูสอนพิเศษ", url: PAGE_PATH },
] as const;

interface FindTutorPageProps {
  // Next.js 16 App Router passes searchParams as a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * /find-tutor — the #1 lead-capture path.
 *
 * Server Component so we can read `searchParams` server-side and pass
 * pre-filled values to the client form. That avoids a client-side flash
 * when the user arrives via HeroSearch (which sets subject/grade/location).
 */
export default async function FindTutorPage({ searchParams }: FindTutorPageProps) {
  const params = (await searchParams) ?? {};
  const pickFirst = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v;

  const subjectParam = pickFirst(params.subject);
  const gradeParam = pickFirst(params.grade);
  const locationParam = pickFirst(params.location);

  const resolvedCategory = resolveCategorySlugFromQuery(subjectParam);
  const resolvedAgeGroup = resolveAgeGroupFromQuery(gradeParam) ?? "";
  const resolvedProvince = resolveProvinceFromQuery(locationParam) ?? "";

  const initialValues = {
    categorySlug: resolvedCategory?.categorySlug ?? "",
    subjectSlug: resolvedCategory?.subjectSlug ?? "",
    ageGroup: resolvedAgeGroup,
    province: resolvedProvince,
    district: "",
    learningGoal: "",
  };

  const breadcrumbSchema = buildBreadcrumbSchema([...BREADCRUMB_ITEMS]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero banner — smaller than Homepage since the form is the product */}
      <section
        aria-label="หาติวเตอร์"
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "หาครูสอนพิเศษ" },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white hover:bg-white/20"
            >
              <Sparkles className="size-3.5" />
              ฟรี ไม่มีค่าใช้จ่าย
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              หาติวเตอร์ที่ใช่ ใน 2 ขั้นตอน
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              กรอกวิชาที่ต้องการก่อน — เราจะแนะนำติวเตอร์ที่เหมาะสม — ค่อยกรอกเบอร์
              ทีมงานจับคู่ให้ภายใน 24 ชั่วโมง
            </p>
          </div>
        </div>
      </section>

      {/* Main split — value panel + form */}
      <section aria-label="ฟอร์มหาครูสอนพิเศษ" className="bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
            <aside
              aria-label="ประโยชน์ที่คุณจะได้รับ"
              className="order-1 h-fit rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm md:p-7"
            >
              <h2 className="text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
                เราช่วยคุณหาครูที่ใช่
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                ไม่ต้องเสียเวลาเลือกเอง — ทีมงานจะคัดเลือกติวเตอร์
                ที่ตรงเป้าหมายและงบของคุณให้
              </p>

              <ul className="mt-5 space-y-4">
                <ValueProp
                  icon={
                    <HeartHandshake className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="ฟรี ไม่มีค่าใช้จ่าย"
                  body="ใช้บริการจับคู่ติวเตอร์ได้ฟรี ไม่มีค่าแรกเข้า ไม่มีค่าสมัคร"
                />
                <ValueProp
                  icon={
                    <BadgeCheck className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="ติวเตอร์คุณภาพ ผ่านการคัดเลือก"
                  body="ติวเตอร์ทุกคนผ่านการสัมภาษณ์ ตรวจสอบวุฒิการศึกษา และประวัติการสอน"
                />
                <ValueProp
                  icon={
                    <Clock3 className="size-5 text-[color:var(--color-primary)]" />
                  }
                  title="จับคู่ภายใน 24 ชั่วโมง"
                  body="ทีมงานจะติดต่อกลับในวันทำการ พร้อมติวเตอร์ให้เลือก 2-3 คน"
                />
              </ul>

              {/* Trust strip — keeps users grounded when they're about to share info */}
              <div className="mt-6 rounded-xl bg-[color:var(--color-light-bg)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  ความเชื่อมั่นของเรา
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <TrustStat value="30K+" label="นักเรียน" />
                  <TrustStat value="500+" label="ติวเตอร์" />
                  <TrustStat value="4.8" label="คะแนนเฉลี่ย" />
                </dl>
              </div>
            </aside>

            <div className="order-2 min-w-0">
              <FindTutorForm initialValues={initialValues} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ---- Small presentational helpers -----------------------------------------

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

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-xs text-[color:var(--color-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[color:var(--color-heading)] md:text-xl">
        {value}
      </dd>
    </div>
  );
}

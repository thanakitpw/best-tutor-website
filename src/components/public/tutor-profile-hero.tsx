import Image from "next/image";
import { GraduationCap, MessageCircle, Phone, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/components/public/mock-data";
import type { MockTutor } from "@/components/public/mock-data";
import type { MockRatingStats } from "@/components/public/mock-reviews";

interface TutorProfileHeroProps {
  tutor: MockTutor;
  stats: MockRatingStats;
}

/**
 * Hero section for `/tutor/[slug]` — the single most important conversion
 * surface on this page. Deliberately follows the 40/60 photo/info split from
 * Paper with three decisions documented here:
 *
 *  1. Primary call-to-action is a phone `tel:` link. The old site sent every
 *     tutor to the same central number; we keep that to respect the operator
 *     workflow (ops screens leads before connecting to tutor).
 *  2. Secondary CTA is LINE — same pattern as the existing sticky CTA so
 *     users have one mental model across the site.
 *  3. Rating + "ยืนยันตัวตน" badge are placed directly under the name so the
 *     social-proof row is above the fold on mobile (< 768 px).
 */
export function TutorProfileHero({ tutor, stats }: TutorProfileHeroProps) {
  const displayName = `${tutor.nickname} ${tutor.firstName}${
    tutor.lastName ? ` ${tutor.lastName}` : ""
  }`.trim();

  const initials = (tutor.nickname.replace(/^ครู/, "").trim() || tutor.firstName).slice(0, 2);

  // Extract keywords for the credentials row. Keeps things readable when DB
  // is still empty — real values will come from Tutor model in Phase 8.
  const credentials: string[] = [
    tutor.education,
    `ประสบการณ์ ${Math.max(3, Math.floor(tutor.rating))} ปี`,
    "สอนตัวต่อตัว",
    "สอนออนไลน์",
  ].filter(Boolean) as string[];

  return (
    <section
      aria-label="ข้อมูลติวเตอร์"
      className="relative overflow-hidden bg-[color:var(--color-light-bg)]"
    >
      {/* Soft gradient wash — light but keeps hero distinct from white body */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-white via-[color:var(--color-light-bg)] to-white"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] md:gap-10 md:px-6 md:py-14 lg:gap-12">
        {/* -- LEFT: Photo (40%) -- */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[15px] bg-white shadow-lg ring-1 ring-black/5 md:max-w-none">
            {tutor.profileImageUrl ? (
              <Image
                src={tutor.profileImageUrl}
                alt={`รูปโปรไฟล์ ${displayName}`}
                fill
                priority
                sizes="(min-width: 768px) 400px, 80vw"
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-primary-dark)] text-6xl font-bold text-white"
              >
                {initials}
              </div>
            )}
            {/* Popular ribbon — echoes TutorCard styling */}
            {tutor.isPopular && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-cta)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-heading)] shadow-sm">
                <Star className="size-3.5 fill-current" />
                ติวเตอร์ยอดนิยม
              </span>
            )}
          </div>
        </div>

        {/* -- RIGHT: Info (60%) -- */}
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-primary)]">
            ติวเตอร์
          </p>

          {/* Name — H1 for SEO */}
          <h1 className="text-3xl font-bold leading-tight text-[color:var(--color-heading)] md:text-4xl lg:text-[42px]">
            {displayName}
          </h1>

          {/* Rating + verified */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-[color:var(--color-border)]">
              <Star className="size-4 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]" />
              <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                {stats.average > 0 ? stats.average.toFixed(1) : tutor.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[color:var(--color-muted)]">
                ({stats.total > 0 ? stats.total : tutor.reviewCount} รีวิว)
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] ring-1 ring-[color:var(--color-success)]/25"
            >
              <ShieldCheck className="size-3.5" />
              ยืนยันตัวตน
            </Badge>
          </div>

          {/* Short bio / intro — from DB `teachingStyle` field. Mock copy while
              seed data is minimal. Kept short so hero doesn't grow too tall. */}
          <p className="max-w-prose text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            สอน{tutor.subjects.slice(0, 2).join(" · ")} ด้วยแนวทางตัวต่อตัว
            เน้นให้นักเรียนคิดเป็น ทำข้อสอบเป็น ไม่ท่องจำ
            เหมาะสำหรับทั้งเตรียมสอบเข้ามหาวิทยาลัยและเสริมทักษะในห้องเรียน
          </p>

          {/* Education card */}
          <div className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 shadow-sm">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-primary)]/10">
              <GraduationCap className="size-5 text-[color:var(--color-primary)]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
                ประวัติการศึกษา
              </span>
              <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                {tutor.education}
              </span>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="grid gap-2 pt-1 sm:grid-cols-2">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[color:var(--color-primary)] text-base font-semibold text-white shadow-sm hover:bg-[color:var(--color-primary-hover)]"
            >
              <a href={CONTACT_INFO.phoneHref}>
                <Phone className="size-5" />
                โทร {CONTACT_INFO.phone}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 bg-[color:var(--color-success)] text-base font-semibold text-white shadow-sm hover:bg-[#16a34a]"
            >
              <a
                href={CONTACT_INFO.lineHref}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle className="size-5" />
                LINE {CONTACT_INFO.lineId}
              </a>
            </Button>
          </div>

          {/* Credentials / features — small row */}
          <div className="flex flex-wrap gap-2 pt-1">
            {credentials.map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="border-[color:var(--color-border)] bg-white/80 px-3 py-1 text-xs font-medium text-[color:var(--color-body)]"
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

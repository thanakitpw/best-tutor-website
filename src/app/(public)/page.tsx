import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck2,
  Clock,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/public/article-card";
import { FeaturedTutorAvatar } from "@/components/public/featured-tutor-avatar";
import { HeroSearch } from "@/components/public/hero-search";
import { StatsBar } from "@/components/public/stats-bar";
import { SubjectCard } from "@/components/public/subject-card";
import {
  CONTACT_INFO,
  MOCK_FAQ_ITEMS,
  MOCK_FEATURED_ARTICLES,
  MOCK_FEATURED_COURSES,
  MOCK_FEATURED_TUTORS,
  MOCK_PARTNER_LOGOS,
  MOCK_POPULAR_SUBJECTS,
  MOCK_TESTIMONIALS,
} from "@/components/public/mock-data";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "หาครูสอนพิเศษ ติวเตอร์ตัวต่อตัว อันดับ 1 ของไทย | Best Tutor Thailand",
  description:
    "แพลตฟอร์มจับคู่ติวเตอร์คุณภาพกว่า 500 คน ครอบคลุมทุกวิชา อังกฤษ คณิตศาสตร์ วิทยาศาสตร์ เรียนที่บ้านหรือออนไลน์ — เป้าหมายของคุณ ความสำเร็จของเรา",
  path: "/",
  keywords: [
    "หาติวเตอร์",
    "ครูสอนพิเศษ",
    "ติวเตอร์ตัวต่อตัว",
    "เรียนพิเศษออนไลน์",
    "ติวเตอร์ภาษาอังกฤษ",
    "ติวเตอร์คณิตศาสตร์",
    "ติวสอบ IELTS",
    "ติวสอบ TGAT",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        schema={[
          buildOrganizationSchema(),
          buildWebSiteSchema(),
          buildLocalBusinessSchema(),
          buildFaqSchema(MOCK_FAQ_ITEMS),
        ]}
      />
      <HeroSection />
      <PopularSubjectsSection />
      <FeaturedCoursesSection />
      <FeaturedTutorsSection />
      <TestimonialsSection />
      <ArticlesSection />
      <PartnersSection />
      <AboutSection />
    </>
  );
}

// ---- Section 1: Hero -------------------------------------------------------

function HeroSection() {
  return (
    <section
      aria-label="ค้นหาติวเตอร์"
      className="relative overflow-hidden bg-[color:var(--color-primary)]"
    >
      {/* Background image — degrades gracefully if asset missing */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/85 via-[color:var(--color-primary)]/80 to-[color:var(--color-accent)]/70" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-6 md:py-24">
        <div className="flex flex-col justify-center gap-6 text-white">
          <Badge
            variant="secondary"
            className="self-start bg-white/15 text-white backdrop-blur hover:bg-white/20"
          >
            <Sparkles className="size-3.5" />
            ติวเตอร์ 500+ คนพร้อมสอน
          </Badge>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            หาครูสอนพิเศษที่ใช่
            <br className="hidden md:block" /> ใกล้บ้านคุณ
          </h1>
          <p className="max-w-xl text-base leading-7 text-white/85 md:text-lg">
            แพลตฟอร์มจับคู่ติวเตอร์คุณภาพตัวต่อตัว ครอบคลุมทุกวิชา เรียนได้ทั้งที่บ้านและออนไลน์ — เป้าหมายของคุณ ความสำเร็จของเรา
          </p>

          <StatsBar variant="light" className="pt-2" />

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[color:var(--color-cta)] px-6 font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
            >
              <Link href="/find-tutor">
                เริ่มหาครู
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/tutors">ดูรายวิชาที่เปิดสอน</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}

// ---- Section 2: Popular subjects (5 thumbnail cards) ---------------------

function PopularSubjectsSection() {
  return (
    <section
      aria-labelledby="popular-subjects-title"
      className="bg-[color:var(--color-alt-bg)]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="เลือกหลักสูตร"
          title="รายวิชาที่ท่านสนใจ"
          description="เรามีติวเตอร์ครอบคลุมทุกวิชาตั้งแต่ประถมจนถึงมหาวิทยาลัย พร้อมคอร์สเตรียมสอบเฉพาะทาง"
          action={
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
            >
              ดูหลักสูตรทั้งหมด
              <ArrowRight className="size-4" />
            </Link>
          }
          titleId="popular-subjects-title"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {MOCK_POPULAR_SUBJECTS.map((subject) => (
            <SubjectCard
              key={subject.slug}
              subject={subject}
              variant="thumbnail"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 3: Featured courses (blue gradient covers) ------------------

function FeaturedCoursesSection() {
  return (
    <section
      aria-labelledby="featured-courses-title"
      className="bg-white"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="คอร์สเรียนแนะนำ"
          title="คอร์สยอดนิยมที่นักเรียนเลือกมากที่สุด"
          description="คอร์สที่ออกแบบโดยติวเตอร์ผู้เชี่ยวชาญ เน้นผลลัพธ์จริง เรียนได้ทั้งที่บ้านและออนไลน์"
          titleId="featured-courses-title"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_FEATURED_COURSES.map((course) => (
            <article
              key={course.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Cover — blue gradient + gold "คอร์ส" ribbon + decorative icon */}
              <div
                className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-5 text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #0B3A7E 0%, #046BD2 100%)",
                }}
                aria-label={course.imageAlt}
              >
                {/* Diagonal highlight slash (decorative) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 size-40 rotate-12 rounded-3xl bg-white/10"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-8 -left-6 size-32 rounded-full bg-white/5"
                />
                {/* Gold ribbon */}
                <span className="absolute right-3 top-3 rotate-6 rounded-md bg-[#FFB800] px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
                  คอร์ส
                </span>

                {/* Lucide decorative icon low-opacity */}
                <GraduationCap
                  aria-hidden
                  className="absolute bottom-4 right-4 size-16 text-white/15"
                />

                {/* Course title — large */}
                <h3 className="relative line-clamp-2 pr-10 pt-6 text-xl font-bold leading-tight md:text-2xl">
                  {course.title}
                </h3>

                {/* Duration badge bottom-left */}
                <span className="relative inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Clock aria-hidden className="size-3.5" />
                  {course.durationHours} ชั่วโมง
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h4 className="line-clamp-2 text-base font-semibold text-[color:var(--color-heading)]">
                  {course.title}
                </h4>
                <p className="line-clamp-2 text-xs leading-5 text-[color:var(--color-muted)]">
                  {course.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 4: Featured tutors (blue BG, circular avatars) --------------

function FeaturedTutorsSection() {
  // Match Paper order: วาวา, มิกะ, วิว, แจม, อลิซ, เนย (already in that order in mock-data)
  const tutors = MOCK_FEATURED_TUTORS.slice(0, 6);
  return (
    <section
      aria-labelledby="featured-tutors-title"
      className="relative overflow-hidden bg-[color:var(--color-primary)]"
    >
      {/* Subtle radial highlight behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center top, rgba(255,255,255,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            แนะนำ
          </p>
          <h2
            id="featured-tutors-title"
            className="text-2xl font-bold leading-tight text-white md:text-3xl"
          >
            ติวเตอร์ที่ได้รับความนิยม
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
            ติวเตอร์มือโปรที่ได้รับคะแนนรีวิวสูง พร้อมประสบการณ์สอนจริงในทุกระดับชั้น
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {tutors.map((tutor) => (
            <FeaturedTutorAvatar key={tutor.slug} tutor={tutor} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="h-11 border-white/40 bg-white/10 px-6 text-white hover:bg-white hover:text-[color:var(--color-primary)]"
          >
            <Link href="/tutors">
              ดูติวเตอร์ทั้งหมด
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ---- Section 5: Testimonials ---------------------------------------------

const TESTIMONIAL_ACCENTS = [
  "#046BD2", // blue
  "#FFB800", // gold
  "#10B981", // green
];

function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-[color:var(--color-light-bg)]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="คู่มือ"
          title="รีวิวจริงจากสถาบัน"
          description="ประสบการณ์จริงจากผู้ที่เคยใช้บริการ Best Tutor Thailand"
          centered
          titleId="testimonials-title"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MOCK_TESTIMONIALS.map((review, index) => {
            const accent = TESTIMONIAL_ACCENTS[index % TESTIMONIAL_ACCENTS.length];
            return (
              <figure
                key={review.id}
                className="relative flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm"
              >
                <span
                  aria-hidden
                  className="block size-3 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      className="size-4 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-6 text-[color:var(--color-body)]">
                  “{review.quote}”
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {review.role}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---- Section 6: Articles --------------------------------------------------

function ArticlesSection() {
  const [feature, ...rest] = MOCK_FEATURED_ARTICLES;
  return (
    <section aria-labelledby="articles-title" className="bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="บทความและข่าวสาร"
          title="อัปเดตแนวทางการเรียนและการสอบ"
          description="บทความคุณภาพที่จะช่วยให้คุณเตรียมตัวและเลือกครูได้อย่างถูกต้อง"
          action={
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
            >
              อ่านบทความทั้งหมด
              <ArrowRight className="size-4" />
            </Link>
          }
          titleId="articles-title"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {feature && <ArticleCard article={feature} variant="feature" />}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Section 7: Partners (moved to bottom, blue BG) ----------------------

function PartnersSection() {
  return (
    <section
      aria-label="สถาบันคู่ความร่วมมือ"
      className="bg-[color:var(--color-primary)]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 text-center md:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          OUR CUSTOMERS
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
          BEST TUTOR THAILAND
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75">
          ติวเตอร์จากมหาวิทยาลัยชั้นนำของไทย ผ่านการคัดกรองคุณภาพก่อนเริ่มสอนจริงทุกคน
        </p>
        <ul className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          {MOCK_PARTNER_LOGOS.map((name) => (
            <li
              key={name}
              className="inline-flex h-10 items-center rounded-full bg-white/15 px-4 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:text-sm"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---- Section 8: About + Contact (merged) ---------------------------------

function AboutSection() {
  interface ContactItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href?: string;
  }
  const contactItems: ContactItem[] = [
    {
      icon: Mail,
      label: "อีเมล",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: Phone,
      label: "โทรศัพท์",
      value: CONTACT_INFO.phone,
      href: CONTACT_INFO.phoneHref,
    },
    {
      icon: MapPin,
      label: "สำนักงาน",
      value: CONTACT_INFO.address,
    },
    {
      icon: CalendarCheck2,
      label: "เวลาทำการ",
      value: CONTACT_INFO.workDays,
    },
  ];

  return (
    <section
      aria-labelledby="about-title"
      className="bg-[color:var(--color-alt-bg)]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
            ติดต่อเรา
          </p>
          <h2
            id="about-title"
            className="text-2xl font-bold leading-tight text-[color:var(--color-heading)] md:text-3xl"
          >
            เกี่ยวกับเรา
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            Best Tutor Thailand รวบรวมติวเตอร์คุณภาพจากมหาวิทยาลัยชั้นนำทั่วประเทศ
            พร้อมระบบคัดกรองที่เข้มงวด และได้รับการกล่าวถึงในรายการ Shark Tank Thailand
            ในฐานะแพลตฟอร์มการศึกษาที่เติบโตอย่างรวดเร็ว
            พร้อมช่วยคุณจับคู่ติวเตอร์ที่เหมาะสมในเวลาไม่เกิน 24 ชั่วโมง
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-[color:var(--color-body)] md:text-base">
            <span className="inline-flex items-center gap-2">
              <BookOpenCheck className="size-4 text-[color:var(--color-primary)]" />
              ครอบคลุมทุกวิชา
            </span>
            <span className="inline-flex items-center gap-2">
              <Lightbulb className="size-4 text-[color:var(--color-primary)]" />
              ปรึกษาฟรีก่อนเริ่มเรียน
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]" />
              คะแนนรีวิวเฉลี่ย 4.8/5
            </span>
          </div>

          <div className="pt-4">
            <Button
              asChild
              className="h-11 bg-[color:var(--color-primary)] px-6 hover:bg-[color:var(--color-primary-hover)]"
            >
              <Link href="/find-tutor">
                ปรึกษาทีมงานฟรี
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Contact cards row */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                    {value}
                  </span>
                </div>
              </>
            );
            if (href) {
              return (
                <a
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-md"
                >
                  {inner}
                </a>
              );
            }
            return (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-sm"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---- Shared section header ------------------------------------------------

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  centered?: boolean;
  titleId?: string;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  centered = false,
  titleId,
}: SectionHeaderProps) {
  return (
    <div
      className={
        centered
          ? "flex flex-col items-center gap-3 text-center"
          : "flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      }
    >
      <div className={centered ? "max-w-2xl space-y-2" : "max-w-2xl space-y-2"}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="text-2xl font-bold leading-tight text-[color:var(--color-heading)] md:text-3xl"
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-6 text-[color:var(--color-muted)] md:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

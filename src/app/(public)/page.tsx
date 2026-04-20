import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Quote,
  Search as SearchIcon,
  Sparkles,
  Star,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/public/article-card";
import { HeroSearch } from "@/components/public/hero-search";
import { StatsBar } from "@/components/public/stats-bar";
import { SubjectCard } from "@/components/public/subject-card";
import { TutorCard } from "@/components/public/tutor-card";
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
      <PartnersSection />
      <PopularSubjectsSection />
      <FeaturedTutorsSection />
      <FeaturedCoursesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ArticlesSection />
      <AboutSection />
      <ContactSection />
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

// ---- Section 2: Partner logos ----------------------------------------------

function PartnersSection() {
  return (
    <section aria-label="สถาบันคู่ความร่วมมือ" className="border-b border-[color:var(--color-border)] bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          ติวเตอร์จากสถาบันชั้นนำของไทย
        </p>
        <ul className="mt-6 grid grid-cols-2 items-center gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {MOCK_PARTNER_LOGOS.map((name) => (
            <li
              key={name}
              className="flex h-12 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)] px-3 text-center text-xs font-semibold text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---- Section 3: Popular subjects ------------------------------------------

function PopularSubjectsSection() {
  return (
    <section aria-labelledby="popular-subjects-title" className="bg-[color:var(--color-alt-bg)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="หมวดวิชายอดนิยม"
          title="เลือกวิชาที่คุณสนใจ"
          description="เรามีติวเตอร์ครอบคลุมทุกวิชาตั้งแต่ประถมจนถึงมหาวิทยาลัย พร้อมทั้งคอร์สเตรียมสอบเฉพาะทาง"
          action={
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
            >
              ดูทุกวิชา
              <ArrowRight className="size-4" />
            </Link>
          }
          titleId="popular-subjects-title"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_POPULAR_SUBJECTS.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 4: Featured tutors -------------------------------------------

function FeaturedTutorsSection() {
  return (
    <section aria-labelledby="featured-tutors-title" className="bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="ติวเตอร์แนะนำ"
          title="ติวเตอร์ยอดนิยมของเรา"
          description="ติวเตอร์มือโปรที่ได้รับคะแนนรีวิวสูง พร้อมประสบการณ์สอนจริง"
          action={
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
            >
              ดูติวเตอร์ทั้งหมด
              <ArrowRight className="size-4" />
            </Link>
          }
          titleId="featured-tutors-title"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {MOCK_FEATURED_TUTORS.slice(0, 6).map((tutor) => (
            <TutorCard key={tutor.slug} tutor={tutor} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 5: Featured courses ------------------------------------------

function FeaturedCoursesSection() {
  return (
    <section aria-labelledby="featured-courses-title" className="bg-[color:var(--color-alt-bg)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="คอร์สแนะนำ"
          title="คอร์สเรียนแพ็คเกจสุดคุ้ม"
          description="คอร์สยอดนิยมที่ออกแบบโดยติวเตอร์ผู้เชี่ยวชาญ เน้นผลลัพธ์จริง"
          titleId="featured-courses-title"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_FEATURED_COURSES.map((course) => (
            <article
              key={course.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="flex aspect-[4/3] items-end p-4 text-[color:var(--color-heading)]"
                style={{ background: course.accentColor }}
                aria-label={course.imageAlt}
              >
                <Badge className="bg-white/80 text-[11px] text-[color:var(--color-heading)]">
                  {course.durationHours} ชั่วโมง
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-[color:var(--color-heading)]">
                  {course.title}
                </h3>
                <p className="line-clamp-3 text-xs leading-5 text-[color:var(--color-muted)]">
                  {course.description}
                </p>
                <Link
                  href="/find-tutor"
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-[color:var(--color-primary)] hover:underline"
                >
                  สอบถามรายละเอียด
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 6: How it works ----------------------------------------------

const HOW_IT_WORKS = [
  {
    icon: SearchIcon,
    title: "1. เลือกวิชาที่ต้องการ",
    description: "กรอกวิชา ระดับชั้น และพื้นที่ที่สะดวก เราจะคัดติวเตอร์ที่เหมาะสมให้",
  },
  {
    icon: Handshake,
    title: "2. จับคู่ติวเตอร์",
    description: "ทีมงานแนะนำติวเตอร์ 3-5 คนให้เลือก ภายใน 24 ชั่วโมง",
  },
  {
    icon: CalendarCheck2,
    title: "3. เริ่มเรียนได้เลย",
    description: "นัดเวลา ตกลงค่าใช้จ่าย และเริ่มเรียนได้ทันทีทั้งที่บ้านและออนไลน์",
  },
] as const;

function HowItWorksSection() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="ขั้นตอนง่าย ๆ"
          title="เริ่มเรียนได้ใน 3 ขั้นตอน"
          description="ไม่ต้องเสียเวลา หาครูดี ๆ ได้ภายในไม่กี่คลิก"
          centered
          titleId="how-it-works-title"
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)] p-6 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[color:var(--color-primary)] text-white shadow-sm">
                <Icon className="size-6" />
              </span>
              <h3 className="text-base font-semibold text-[color:var(--color-heading)]">
                {title}
              </h3>
              <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---- Section 7: Testimonials ----------------------------------------------

function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-[color:var(--color-light-bg)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="รีวิวจากผู้เรียนจริง"
          title="ฟีดแบ็กจากนักเรียนและผู้ปกครอง"
          description="ประสบการณ์จริงจากผู้ที่เคยใช้บริการ Best Tutor Thailand"
          centered
          titleId="testimonials-title"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MOCK_TESTIMONIALS.map((review) => (
            <figure
              key={review.id}
              className="relative flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm"
            >
              <Quote
                aria-hidden
                className="size-8 text-[color:var(--color-primary)]/20"
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
                <p className="text-xs text-[color:var(--color-muted)]">{review.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 8: Articles --------------------------------------------------

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

// ---- Section 9: About -----------------------------------------------------

function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="bg-[color:var(--color-alt-bg)]">
      <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
        <div className="flex flex-col justify-center gap-4">
          <Badge variant="secondary" className="self-start bg-white text-[color:var(--color-primary)]">
            <Award className="size-3.5" />
            เกี่ยวกับเรา
          </Badge>
          <h2
            id="about-title"
            className="text-2xl font-bold leading-tight text-[color:var(--color-heading)] md:text-3xl"
          >
            Best Tutor Thailand — พันธมิตรทางการศึกษาที่คุณไว้วางใจ
          </h2>
          <p className="text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            เรารวบรวมติวเตอร์คุณภาพจากมหาวิทยาลัยชั้นนำทั่วประเทศ
            พร้อมระบบคัดกรองที่เข้มงวด และได้รับการกล่าวถึงในรายการ Shark Tank Thailand
            ในฐานะแพลตฟอร์มการศึกษาที่เติบโตอย่างรวดเร็ว
          </p>
          <ul className="grid gap-3 pt-2 sm:grid-cols-2">
            {[
              { icon: Users2, label: "ติวเตอร์ตรวจสอบคุณสมบัติ" },
              { icon: BookOpenCheck, label: "ครอบคลุมทุกวิชาและทุกระดับ" },
              { icon: Star, label: "คะแนนรีวิวเฉลี่ย 4.8/5" },
              { icon: CheckCircle2, label: "เปลี่ยนครูฟรีในชั่วโมงแรก" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-[color:var(--color-body)]">
                <Icon className="size-4 text-[color:var(--color-primary)]" />
                {label}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Button asChild className="h-11 bg-[color:var(--color-primary)] px-6 hover:bg-[color:var(--color-primary-hover)]">
              <Link href="/find-tutor">
                ปรึกษาทีมงานฟรี
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "500+", label: "ติวเตอร์คุณภาพ" },
            { value: "30,000+", label: "นักเรียนที่ไว้วางใจ" },
            { value: "4.8/5", label: "คะแนนเฉลี่ย" },
            { value: "24 ชม.", label: "จับคู่ติวเตอร์ได้ไว" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-start gap-2 rounded-2xl border border-[color:var(--color-border)] bg-white p-5"
            >
              <span className="text-2xl font-bold text-[color:var(--color-primary)] md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-[color:var(--color-muted)] md:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 10: Contact --------------------------------------------------

function ContactSection() {
  interface ContactItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href?: string;
  }
  const contactItems: ContactItem[] = [
    {
      icon: Phone,
      label: "โทรศัพท์",
      value: CONTACT_INFO.phone,
      href: CONTACT_INFO.phoneHref,
    },
    {
      icon: Mail,
      label: "อีเมล",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
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
    <section aria-labelledby="contact-title" className="bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="ติดต่อเรา"
          title="พร้อมช่วยคุณหาครูที่ใช่"
          description="ทีมงานพร้อมให้คำปรึกษาและจับคู่ติวเตอร์ที่เหมาะสมให้คุณในเวลาอันรวดเร็ว"
          centered
          titleId="contact-title"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <span className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
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
                  className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-md"
                >
                  {inner}
                </a>
              );
            }
            return (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm"
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

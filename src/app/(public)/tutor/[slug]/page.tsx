import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Car,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/public/breadcrumb";
import {
  MOCK_ALL_CATEGORIES,
  MOCK_FEATURED_TUTORS,
  MOCK_POPULAR_SUBJECTS,
  type MockTutor,
} from "@/components/public/mock-data";
import {
  getMockReviewsByTutorSlug,
  getRelatedMockTutors,
  mockRatingStats,
} from "@/components/public/mock-reviews";
import { TutorCard } from "@/components/public/tutor-card";
import { TutorContactForm } from "@/components/public/tutor-contact-form";
import { TutorProfileHero } from "@/components/public/tutor-profile-hero";
import { TutorProfileTabs } from "@/components/public/tutor-profile-tabs";
import { TutorReviews } from "@/components/public/tutor-reviews";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildBreadcrumbSchema,
  buildPersonSchema,
  buildReviewSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site-metadata";

// ---- Data helpers ----------------------------------------------------------
// `mockTutorBySlug` + the category lookup are temporary — Phase 8 will replace
// them with calls to `/api/tutors/[slug]`. Returning `null` on miss so the
// page can call `notFound()`.

function mockTutorBySlug(slug: string): MockTutor | null {
  return MOCK_FEATURED_TUTORS.find((t) => t.slug === slug) ?? null;
}

/** Best-effort mapping from a tutor's subject names to a subject category
 * slug from `MOCK_ALL_CATEGORIES`. Used by breadcrumb and for the lead
 * `subjectCategory` field. Returns a sensible fallback instead of throwing. */
function matchCategory(subjects: readonly string[]): {
  name: string;
  slug: string;
} {
  const subject = subjects[0] ?? "";
  // Popular subjects carry specific names; try those first for better match.
  const popular = MOCK_POPULAR_SUBJECTS.find((cat) =>
    subject.includes(cat.name) || cat.name.includes(subject),
  );
  if (popular) return { name: popular.name, slug: popular.slug };
  const broad = MOCK_ALL_CATEGORIES.find((cat) =>
    cat.tagline?.includes(subject) || subject.includes(cat.name),
  );
  if (broad) return { name: broad.name, slug: broad.slug };
  return { name: "รายวิชาที่เปิดสอน", slug: "tutors" };
}

// ---- Static params ---------------------------------------------------------
// Pre-render all mocked tutors at build time so the profile pages work even
// when the DB is empty. Additional slugs fall through to `notFound()`.

export function generateStaticParams() {
  return MOCK_FEATURED_TUTORS.map((t) => ({ slug: t.slug }));
}

// ---- Metadata --------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tutor = mockTutorBySlug(slug);

  if (!tutor) {
    return buildMetadata({
      title: "ไม่พบติวเตอร์",
      description: "ไม่พบติวเตอร์ที่คุณค้นหา กลับไปเลือกติวเตอร์ท่านอื่นได้ที่หน้ารวมวิชา",
      path: `/tutor/${slug}`,
      noIndex: true,
    });
  }

  const stats = mockRatingStats(tutor.slug);
  const displayName = `${tutor.nickname} ${tutor.firstName}${
    tutor.lastName ? ` ${tutor.lastName}` : ""
  }`.trim();
  const mainSubject = tutor.subjects[0] ?? "ติวเตอร์";
  const ratingLabel = stats.total > 0 ? stats.average.toFixed(1) : tutor.rating.toFixed(1);

  const title = `${displayName} ติวเตอร์${mainSubject} ★${ratingLabel} | Best Tutor Thailand`;
  const description = `${displayName} ติวเตอร์${tutor.subjects.join(" · ")} จาก${tutor.education} สอนตัวต่อตัวทั้งที่บ้านและออนไลน์${
    tutor.province ? ` พื้นที่ ${tutor.province}` : ""
  } เริ่มต้น ฿${tutor.ratePricing.toLocaleString("th-TH")}/ชม. ★${ratingLabel} จาก ${stats.total || tutor.reviewCount} รีวิว`;

  return buildMetadata({
    title,
    description,
    path: `/tutor/${tutor.slug}`,
    keywords: [
      `ติวเตอร์${mainSubject}`,
      `ครูสอน${mainSubject}`,
      displayName,
      ...tutor.subjects.map((s) => `ติวเตอร์${s}`),
      "เรียนพิเศษตัวต่อตัว",
    ],
    ogImage: tutor.profileImageUrl ?? undefined,
    ogType: "profile",
  });
}

// ---- Page ------------------------------------------------------------------

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutor = mockTutorBySlug(slug);
  if (!tutor) {
    notFound();
  }

  const reviews = getMockReviewsByTutorSlug(tutor.slug);
  const stats = mockRatingStats(tutor.slug);
  const category = matchCategory(tutor.subjects);
  const related = getRelatedMockTutors(tutor, MOCK_FEATURED_TUTORS, 3);
  const displayName = `${tutor.nickname} ${tutor.firstName}${
    tutor.lastName ? ` ${tutor.lastName}` : ""
  }`.trim();
  const experienceYears = Math.max(3, Math.floor(tutor.rating));

  // ---- JSON-LD -------------------------------------------------------------
  // Person schema embeds aggregateRating when present. We also emit the top 5
  // reviews individually so Google's rich-result preview can render stars.
  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: category.name, url: category.slug === "tutors" ? "/tutors" : `/subject/${category.slug}` },
    { name: displayName, url: `/tutor/${tutor.slug}` },
  ] as const;

  const personSchema = buildPersonSchema({
    id: tutor.slug,
    slug: tutor.slug,
    nickname: tutor.nickname,
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    profileImageUrl: tutor.profileImageUrl,
    education: tutor.education,
    subjects: tutor.subjects.map((s, i) => ({ id: `${tutor.slug}-s${i}`, name: s, slug: slugify(s) })),
    averageRating: stats.total > 0 ? stats.average : tutor.rating,
    reviewCount: stats.total > 0 ? stats.total : tutor.reviewCount,
  });

  const tutorIri = `${SITE_URL}/tutor/${tutor.slug}#person`;
  const reviewSchemas = reviews.slice(0, 5).map((r) =>
    buildReviewSchema(
      {
        id: r.id,
        reviewerName: r.reviewerName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      },
      {
        itemReviewedId: tutorIri,
        itemReviewedType: "Person",
        itemReviewedName: displayName,
      },
    ),
  );
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd
        schema={[breadcrumbSchema, personSchema, ...reviewSchemas]}
        id="tutor-profile-jsonld"
      />

      {/* Top breadcrumb — sits above hero on the light bg */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 md:px-6 md:pt-7">
          <Breadcrumb
            items={[
              { name: "หน้าแรก", href: "/" },
              {
                name: category.name,
                href: category.slug === "tutors" ? "/tutors" : `/subject/${category.slug}`,
              },
              { name: displayName },
            ]}
          />
        </div>
      </div>

      <TutorProfileHero tutor={tutor} stats={stats} />

      {/* Tabs + body content */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-4 pb-10 md:px-6 md:pt-6 md:pb-14">
          <TutorProfileTabs
            reviewCount={stats.total || tutor.reviewCount}
            about={<AboutTab tutor={tutor} />}
            experience={<ExperienceTab tutor={tutor} experienceYears={experienceYears} />}
            reviews={
              <TutorReviews
                tutorSlug={tutor.slug}
                tutorDisplayName={displayName}
                reviews={reviews}
                stats={stats}
              />
            }
            courses={<CoursesTab tutor={tutor} />}
          />
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-[color:var(--color-alt-bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-6 md:py-16">
          <TutorContactForm
            tutorNickname={tutor.nickname.replace(/^ครู/, "")}
            tutorSlug={tutor.slug}
            subjects={tutor.subjects}
            subjectCategory={category.name}
          />
        </div>
      </section>

      {/* Related tutors */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-6 md:py-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
                  ติวเตอร์{tutor.subjects[0] ?? ""}ท่านอื่นที่คุณอาจสนใจ
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  เปรียบเทียบสไตล์การสอน ราคา และรีวิวก่อนตัดสินใจ
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="hidden text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/5 md:inline-flex"
              >
                <Link href="/tutors">ดูทั้งหมด</Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TutorCard
                  key={t.slug}
                  tutor={{
                    slug: t.slug,
                    nickname: t.nickname,
                    firstName: t.firstName,
                    lastName: t.lastName,
                    profileImageUrl: t.profileImageUrl,
                    rating: t.rating,
                    reviewCount: t.reviewCount,
                    ratePricing: t.ratePricing,
                    subjects: t.subjects,
                    province: t.province,
                    education: t.education,
                    isPopular: t.isPopular,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ---- Tab content (server components) --------------------------------------

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
          {label}
        </span>
        <span className="text-sm font-semibold text-[color:var(--color-heading)]">{value}</span>
      </div>
    </div>
  );
}

function AboutTab({ tutor }: { tutor: MockTutor }) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-[color:var(--color-heading)]">
            เกี่ยวกับครู{tutor.nickname.replace(/^ครู/, "")}
          </h2>
          <p className="mt-3 text-sm leading-8 text-[color:var(--color-body)] md:text-base">
            ครู{tutor.nickname.replace(/^ครู/, "")}เป็นติวเตอร์ที่มีประสบการณ์
            สอน{tutor.subjects.join(" · ")}มาหลายปี
            เน้นให้นักเรียนเข้าใจแนวคิดพื้นฐานก่อนลงมือทำข้อสอบจริง
            สามารถปรับสไตล์การสอนให้เหมาะกับระดับชั้นและเป้าหมายของนักเรียน
            ไม่ว่าจะเป็นการเพิ่มเกรด เตรียมสอบเข้ามหาวิทยาลัย หรือพัฒนาทักษะเฉพาะด้าน
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold text-[color:var(--color-heading)]">
            แนวการสอน
          </h3>
          <ul className="space-y-2">
            {[
              "เข้าใจพื้นฐานก่อนลงรายละเอียด ไม่ข้ามขั้น",
              "ตั้งเป้าหมายรายเดือน + รายงานผลให้ผู้ปกครองทุกสัปดาห์",
              "มีแบบฝึกหัดเพิ่มให้ทำที่บ้านทุกคาบ พร้อมเฉลยละเอียด",
              "ปรับจังหวะการสอนตามพื้นฐานและสไตล์ของนักเรียน",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm leading-7 text-[color:var(--color-body)]"
              >
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-[color:var(--color-success)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold text-[color:var(--color-heading)]">
            วิชาที่สอน
          </h3>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="bg-[color:var(--color-light-bg)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-primary)]"
              >
                <BookOpen className="size-3.5" />
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-3">
        <InfoCard
          icon={<Wallet className="size-5" />}
          label="ค่าเรียนเริ่มต้น"
          value={`฿${tutor.ratePricing.toLocaleString("th-TH")} / ชั่วโมง`}
        />
        <InfoCard
          icon={<MapPin className="size-5" />}
          label="พื้นที่สอน"
          value={tutor.province ? `${tutor.province} และออนไลน์` : "ทั่วประเทศ (ออนไลน์)"}
        />
        <InfoCard
          icon={<Clock className="size-5" />}
          label="รูปแบบการสอน"
          value="ตัวต่อตัว / กลุ่มเล็ก / ออนไลน์"
        />
      </aside>
    </div>
  );
}

function ExperienceTab({
  tutor,
  experienceYears,
}: {
  tutor: MockTutor;
  experienceYears: number;
}) {
  // Mocked background — will come from Tutor model fields (education,
  // pastSchools, credentials) once the CMS feeds real data in Phase 8.
  const pastSchools = [
    "โรงเรียนสาธิตจุฬาลงกรณ์มหาวิทยาลัย",
    "สถาบันกวดวิชา TOP Tutor",
    "นักเรียนเตรียมอุดมฯ รุ่นพี่สอนน้อง",
  ];
  const credentials = [
    "ผ่านการอบรมครูสอนพิเศษ Best Tutor Academy",
    `ประสบการณ์สอน ${experienceYears}+ ปี`,
    tutor.subjects.includes("IELTS") || tutor.subjects.includes("SAT")
      ? "Certified English Language Tutor"
      : "ครูผู้ช่วยสอนที่จุฬาลงกรณ์มหาวิทยาลัย",
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <InfoCard
        icon={<GraduationCap className="size-5" />}
        label="การศึกษา"
        value={tutor.education}
      />
      <InfoCard
        icon={<Sparkles className="size-5" />}
        label="ประสบการณ์สอน"
        value={`${experienceYears}+ ปี`}
      />

      <div className="md:col-span-2">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[color:var(--color-heading)]">
          <Briefcase className="size-5 text-[color:var(--color-primary)]" />
          สถาบัน / โรงเรียนที่เคยสอน
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {pastSchools.map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-body)] shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--color-primary)]" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[color:var(--color-heading)]">
          <Award className="size-5 text-[color:var(--color-primary)]" />
          ใบรับรอง / คุณสมบัติ
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {credentials.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2 rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-body)] shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--color-success)]" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <InfoCard
        icon={<Car className="size-5" />}
        label="การเดินทาง"
        value="รับงานทั้งที่บ้านนักเรียนและออนไลน์"
      />
    </div>
  );
}

function CoursesTab({ tutor }: { tutor: MockTutor }) {
  // Placeholder courses — real course records will be joined from the `Course`
  // Prisma model in Phase 8. Shape mirrors the eventual `MockCourse` fields.
  const courses = [
    {
      title: `คอร์ส${tutor.subjects[0] ?? "พื้นฐาน"} ปูพื้นฐาน`,
      duration: "12 ชั่วโมง (6 คาบ)",
      description: `สำหรับผู้เริ่มต้น ครอบคลุมพื้นฐานวิชา${tutor.subjects[0] ?? ""} เน้นให้เข้าใจคอนเซ็ปต์ก่อนลงรายละเอียด`,
    },
    {
      title: `คอร์สเข้มข้น เพิ่มเกรด-สอบเข้า`,
      duration: "30 ชั่วโมง (15 คาบ)",
      description: "เตรียมสอบเข้ามหาวิทยาลัย ฝึกทำข้อสอบย้อนหลัง 10 ปี พร้อมเทคนิคทำข้อสอบ",
    },
    {
      title: `คอร์สเฉพาะบุคคล (ตามความต้องการ)`,
      duration: "ยืดหยุ่นตามตกลง",
      description: "ปรับเนื้อหาและจังหวะตามเป้าหมายของนักเรียน เหมาะกับผู้ที่มีพื้นฐานแล้วต้องการจุดเน้นเฉพาะ",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {courses.map((c) => (
        <article
          key={c.title}
          className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm"
        >
          <h3 className="text-base font-semibold text-[color:var(--color-heading)]">{c.title}</h3>
          <div className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
            <Clock className="size-3.5" />
            {c.duration}
          </div>
          <p className="flex-1 text-sm leading-6 text-[color:var(--color-body)]">{c.description}</p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-2 border-[color:var(--color-primary)]/30 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/5"
          >
            <Link href="/find-tutor">ดูรายละเอียด</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}

// ---- utilities -------------------------------------------------------------

/** ASCII-only slug fallback for subject names. Real DB rows will already have
 * a `slug` field so this is only used by the mock JSON-LD builder. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    || "subject";
}

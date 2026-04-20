import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  CreditCard,
  Quote,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/public/breadcrumb";
import {
  JoinFaqAccordion,
  type JoinFaqItem,
} from "@/components/public/join-faq-accordion";
import { StatsBar } from "@/components/public/stats-bar";
import { JsonLd } from "@/lib/seo/json-ld-script";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/join-with-us";
const PAGE_TITLE =
  "สมัครเป็นติวเตอร์ สอนพิเศษตัวต่อตัว — ร่วมทีมกับ Best Tutor Thailand";
const PAGE_DESCRIPTION =
  "ร่วมเป็นติวเตอร์กับ Best Tutor Thailand มีนักเรียนกว่า 30,000 คนรอคุณอยู่ ทีมงานดูแลการจับคู่ให้ครบ อนุมัติภายใน 48 ชั่วโมง กำหนดอัตราค่าสอนเองได้";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "สมัครเป็นติวเตอร์",
    "หางานสอนพิเศษ",
    "หารายได้เสริมจากการสอน",
    "ครูสอนพิเศษ",
    "รับสมัครติวเตอร์",
    "งานติวเตอร์ออนไลน์",
  ],
});

const BREADCRUMB_ITEMS = [
  { name: "หน้าแรก", url: "/" },
  { name: "สมัครเป็นติวเตอร์", url: PAGE_PATH },
] as const;

const BENEFITS = [
  {
    icon: CreditCard,
    title: "รายได้ที่ดี",
    body: "กำหนดอัตราค่าสอนของคุณเอง เริ่มต้นสร้างรายได้จากความรู้และความเชี่ยวชาญที่มี โดยไม่ต้องผ่านเอเจนซี่ที่หักค่าหัวคิวสูง",
  },
  {
    icon: Users,
    title: "ทีมซัพพอร์ตครบวงจร",
    body: "ทีมงานของเราช่วยจัดตารางเรียน จับคู่นักเรียนที่เหมาะกับคุณ และดูแลตลอดการสอน ทำให้คุณโฟกัสที่การสอนอย่างเดียว",
  },
  {
    icon: UserCircle,
    title: "สร้างโปรไฟล์เฉพาะตัว",
    body: "เรามีระบบโปรไฟล์แบบครบถ้วนให้คุณโชว์ผลงาน ประสบการณ์ และรีวิว นักเรียนสามารถค้นหาและเลือกคุณได้ง่าย",
  },
  {
    icon: Clock,
    title: "ยืดหยุ่น เลือกเวลาเอง",
    body: "คุณเลือกวัน เวลา และสถานที่ในการสอนได้ตามสะดวก จะสอนที่บ้านนักเรียน ที่ทำงาน หรือออนไลน์ก็ได้",
  },
] as const;

const PROCESS_STEPS = [
  {
    step: 1,
    title: "สมัครและกรอกข้อมูล",
    body: "กรอกประวัติการศึกษา ประสบการณ์การสอน วิชาที่ถนัด และอัตราค่าสอน พร้อมแนบเอกสารที่เกี่ยวข้อง (หรือส่งตามภายหลังก็ได้)",
  },
  {
    step: 2,
    title: "รอทีมตรวจสอบ",
    body: "ทีมงานจะตรวจสอบคุณสมบัติและติดต่อกลับภายใน 48 ชั่วโมง หากมีข้อสงสัย เจ้าหน้าที่จะสัมภาษณ์เพิ่มเติมทางโทรศัพท์หรือวิดีโอคอล",
  },
  {
    step: 3,
    title: "เริ่มรับงานสอน",
    body: "เมื่ออนุมัติแล้ว โปรไฟล์คุณจะเผยแพร่ทันที และเริ่มได้รับแจ้งเตือนงานที่เหมาะกับคุณ เลือกตอบรับงานได้อย่างยืดหยุ่น",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "ทีมงานดูแลดีมาก ช่วยหาน้องๆ ที่สนใจวิชาเราจริงๆ ไม่ต้องเสียเวลาเปิดโปรไฟล์ไปเรื่อยๆ ทำให้มีรายได้เสริมสม่ำเสมอทุกเดือน",
    name: "ครูวาวา",
    subject: "ภาษาอังกฤษ / IELTS",
  },
  {
    quote:
      "สมัครแล้วได้งานสอนภายในสัปดาห์แรก ทีมจับคู่ได้ตรงกับสไตล์การสอนของเรามาก นักเรียนพอใจแล้วเราก็พอใจด้วยค่ะ",
    name: "ครูมิกะ",
    subject: "ภาษาจีน / HSK",
  },
  {
    quote:
      "เริ่มจากสอนพาร์ตไทม์ตอนเป็นนิสิต ตอนนี้มีนักเรียนต่อเนื่องเกือบ 20 คน ระบบช่วยเก็บตารางและติดตามค่าตอบแทนได้สะดวกดี",
    name: "ครูวิว",
    subject: "คณิตศาสตร์ / ฟิสิกส์",
  },
] as const;

const FAQ_ITEMS: readonly JoinFaqItem[] = [
  {
    id: "qualifications",
    question: "ต้องมีคุณสมบัติอะไรบ้าง?",
    answer:
      "ผู้สมัครควรมีอายุ 18 ปีขึ้นไป มีความรู้ในวิชาที่ต้องการสอนในระดับที่สามารถอธิบายให้ผู้อื่นเข้าใจได้ เช่น กำลังศึกษาระดับมหาวิทยาลัยหรือสูงกว่า หรือมีประสบการณ์ในวิชาชีพที่เกี่ยวข้อง หากยังไม่มีประสบการณ์สอน สามารถสมัครได้เช่นกัน ทีมงานจะพิจารณาจากพื้นฐานวิชาและทัศนคติในการสอนเป็นหลัก",
  },
  {
    id: "approval-time",
    question: "เริ่มต้นได้ใน 48 ชั่วโมงจริงไหม?",
    answer:
      "ใช่ค่ะ หากข้อมูลในฟอร์มครบถ้วน ทีมงานจะติดต่อกลับภายใน 48 ชั่วโมงในวันทำการ (จันทร์-เสาร์) เพื่อสัมภาษณ์สั้นๆ และยืนยันเอกสาร เมื่ออนุมัติแล้วโปรไฟล์คุณจะเผยแพร่ทันที และสามารถเริ่มรับงานได้เลยตามวิชาที่ถนัด บางท่านได้งานสอนแรกภายในสัปดาห์เดียว",
  },
  {
    id: "commission",
    question: "ค่าคอมมิชชั่นหรือค่าธรรมเนียมเป็นอย่างไร?",
    answer:
      "Best Tutor Thailand เก็บค่าธรรมเนียมเฉพาะเมื่อจับคู่งานสำเร็จเท่านั้น (โดยทั่วไปอยู่ที่ประมาณ 20-25% ของค่าสอนเดือนแรก) ไม่มีค่าสมัคร ไม่มีค่าแรกเข้า และไม่หักรายได้ในเดือนต่อๆ ไป ทีมเราจะแจ้งเงื่อนไขและอัตราให้ทราบชัดเจนก่อนเริ่มงานทุกครั้ง",
  },
  {
    id: "travel",
    question: "ต้องเดินทางไปสอนที่บ้านนักเรียนหรือไม่?",
    answer:
      "คุณสามารถเลือกรูปแบบการสอนได้ตามสะดวก ทั้งสอนที่บ้านนักเรียน สอนออนไลน์ผ่าน Zoom/Google Meet หรือสอนในสถานที่นัดพบ เช่น ร้านกาแฟหรือห้องสมุด ในฟอร์มสมัคร คุณจะระบุจังหวัด/เขตที่สะดวกเดินทาง และพาหนะที่ใช้ ทีมจะจับคู่งานให้เหมาะสม",
  },
  {
    id: "no-experience",
    question: "ถ้าไม่เคยสอนมาก่อน สมัครได้ไหม?",
    answer:
      "สมัครได้ค่ะ ติวเตอร์ใหม่หลายคนของเราเริ่มจากไม่มีประสบการณ์ เราพิจารณาจากความแข็งแรงของพื้นฐานวิชา ทัศนคติที่ดีต่อการสอน และความรับผิดชอบ หากคุณผ่านการสัมภาษณ์ ทีมจะช่วยแนะนำเทคนิคการเริ่มต้น และเริ่มจับคู่จากนักเรียนระดับที่เหมาะกับคุณก่อน",
  },
  {
    id: "income-expectation",
    question: "รายได้ขั้นต่ำโดยประมาณเท่าไหร่?",
    answer:
      "ขึ้นอยู่กับวิชา อัตราค่าสอนที่ตั้งไว้ และจำนวนชั่วโมงที่สอนต่อสัปดาห์ ติวเตอร์ทั่วไปที่สอน 10-15 ชั่วโมง/สัปดาห์ ที่อัตรา 400-600 บาท/ชั่วโมง จะมีรายได้ประมาณ 16,000-36,000 บาท/เดือน สำหรับวิชาเฉพาะทางหรือเตรียมสอบ (IELTS, SAT, แพทย์) อัตราจะสูงกว่านี้ได้มาก ทีมงานสามารถให้คำแนะนำเรื่องการตั้งราคาให้เหมาะกับตลาดได้",
  },
];

/**
 * /join-with-us — sales pitch for prospective tutors (top-of-funnel for tutor
 * supply). Drives clicks to `/tutor-register`.
 *
 * Server Component throughout; accordion carved out as its own client
 * component since Radix needs the client runtime.
 */
export default function JoinWithUsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([...BREADCRUMB_ITEMS]);
  const faqSchema = buildFaqSchema(
    FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, faqSchema]} />

      {/* Hero */}
      <section
        aria-label="ร่วมทีมติวเตอร์"
        className="relative overflow-hidden bg-[color:var(--color-primary)] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-12 md:px-6 md:py-20">
          <Breadcrumb
            variant="light"
            items={[
              { name: "หน้าแรก", href: "/" },
              { name: "สมัครเป็นติวเตอร์" },
            ]}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="flex flex-col gap-4">
              <Badge
                variant="secondary"
                className="self-start bg-white/15 text-white hover:bg-white/20"
              >
                <Sparkles className="size-3.5" />
                เปิดรับสมัครติวเตอร์ตลอดทั้งปี
              </Badge>
              <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                สอนพิเศษตัวต่อตัว สอนออนไลน์ —
                <br className="hidden md:block" />
                ร่วมทีมกับเรา
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-base lg:text-lg">
                สร้างรายได้จากความรู้ของคุณ มีนักเรียนกว่า 30,000 คนรอคุณอยู่
                — กำหนดอัตราค่าสอนเอง ทำงานยืดหยุ่น ทีมงานดูแลการจับคู่ให้ครบ
              </p>
              <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-[color:var(--color-cta)] px-6 text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
                >
                  <Link href="/tutor-register">
                    ลงทะเบียนสมัครเป็นติวเตอร์
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Link
                  href="#benefits"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  ดูรายละเอียด
                </Link>
              </div>

              <StatsBar
                variant="light"
                className="mt-4"
                items={[
                  { value: "30,000+", label: "นักเรียนในระบบ" },
                  { value: "500+", label: "ติวเตอร์คุณภาพ" },
                  { value: "4.8", label: "คะแนนเฉลี่ย" },
                ]}
              />
            </div>

            {/* Hero "highlight" card — promise of 48hr approval */}
            <aside className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-cta)]">
                  ทำไมต้อง Best Tutor Thailand
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white">
                  <HeroBullet>อนุมัติไว ภายใน 48 ชม.</HeroBullet>
                  <HeroBullet>ทีมงานจัดตารางและจับคู่ให้</HeroBullet>
                  <HeroBullet>ไม่มีค่าสมัคร ไม่มีค่าแรกเข้า</HeroBullet>
                  <HeroBullet>เลือกสอน online หรือ onsite ได้</HeroBullet>
                  <HeroBullet>มีโปรไฟล์ส่วนตัวช่วยให้นักเรียนค้นพบ</HeroBullet>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefits"
        aria-label="ประโยชน์ที่ได้รับ"
        className="bg-[color:var(--color-alt-bg)] py-12 md:py-20"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              ข้อดีของการเป็นติวเตอร์กับเรา
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
              ทำไมติวเตอร์เลือกสมัครกับ Best Tutor Thailand
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-muted)] md:text-base">
              เราสร้างระบบที่ช่วยให้คุณโฟกัสกับการสอน ส่วนเรื่องการหา-จับคู่นักเรียน
              และการจัดการทั้งหมด เราดูแลให้
            </p>
          </header>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-full bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]"
                  >
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[color:var(--color-heading)] md:text-lg">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                    {benefit.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        aria-label="ขั้นตอนการสมัคร"
        className="bg-white py-12 md:py-20"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              ขั้นตอนง่ายๆ
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
              เริ่มได้ใน 3 ขั้นตอน
            </h2>
          </header>

          <ol className="relative mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {PROCESS_STEPS.map((process, index) => (
              <li
                key={process.step}
                className="relative rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)] p-6 md:p-7"
              >
                <span
                  aria-hidden
                  className="inline-flex size-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-lg font-bold text-white"
                >
                  {process.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-[color:var(--color-heading)]">
                  {process.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                  {process.body}
                </p>
                {/* Decorative connector — hide on last, only on desktop */}
                {index < PROCESS_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-4 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[color:var(--color-primary)] shadow md:inline-flex"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section
        aria-label="เสียงจากติวเตอร์"
        className="bg-[color:var(--color-alt-bg)] py-12 md:py-20"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              เสียงจริงจากติวเตอร์
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
              ติวเตอร์ของเราพูดถึงเราแบบนี้
            </h2>
          </header>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm"
              >
                <Quote
                  aria-hidden
                  className="size-7 text-[color:var(--color-primary)]/30"
                />
                <blockquote className="mt-3 flex-1 text-sm leading-7 text-[color:var(--color-body)] md:text-base">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-[color:var(--color-border)] pt-4">
                  <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {testimonial.subject}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-label="คำถามที่พบบ่อย"
        className="bg-white py-12 md:py-20"
      >
        <div className="mx-auto w-full max-w-[860px] px-4 md:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              คำถามที่พบบ่อย
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--color-heading)] md:text-3xl">
              มีคำถามเรื่องการสมัคร?
            </h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              คำถามส่วนใหญ่ที่ติวเตอร์ใหม่ถามเราบ่อยๆ — ถ้ายังไม่เจอคำตอบ
              ทัก LINE เราได้ตลอด
            </p>
          </header>

          <div className="mt-8">
            <JoinFaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        aria-label="ลงทะเบียนสมัครเป็นติวเตอร์"
        className="relative overflow-hidden bg-[color:var(--color-primary)] py-14 text-white md:py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/60" />
        <div className="relative z-10 mx-auto w-full max-w-[860px] px-4 text-center md:px-6">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            พร้อมแล้วใช่ไหม? ลงทะเบียนฟรีตอนนี้
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/90 md:text-base">
            กรอกข้อมูลเพียง 3 ขั้นตอนสั้นๆ ทีมงานจะติดต่อกลับภายใน 48 ชั่วโมง
            และเริ่มรับงานสอนได้ทันที
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[color:var(--color-cta)] px-6 text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
            >
              <Link href="/tutor-register">
                ลงทะเบียนสมัครเป็นติวเตอร์
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/70">
            ไม่มีค่าสมัคร ไม่มีค่าแรกเข้า • อนุมัติภายใน 48 ชั่วโมง
          </p>
        </div>
      </section>
    </>
  );
}

function HeroBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-[color:var(--color-cta)]"
      />
      <span className="leading-6">{children}</span>
    </li>
  );
}

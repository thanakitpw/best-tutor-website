import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";

import { CONTACT_INFO, MOCK_ALL_CATEGORIES } from "@/components/public/mock-data";

/**
 * Public site footer — 4-column layout on desktop, stacked on mobile.
 * Provides internal links for SEO + contact info for Lead Gen.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-primary)] text-lg font-bold text-white"
              >
                BT
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-[color:var(--color-heading)]">
                  Best Tutor Thailand
                </span>
                <span className="text-[11px] font-medium text-[color:var(--color-muted)]">
                  เป้าหมายของคุณ ความสำเร็จของเรา
                </span>
              </div>
            </div>
            <p className="text-sm leading-6 text-[color:var(--color-muted)]">
              เรามุ่งมั่นจับคู่ผู้เรียนกับติวเตอร์ระดับแนวหน้า พร้อมนำทางคุณสู่ความสำเร็จ
            </p>
            <div className="flex items-center gap-3" aria-label="ช่องทางโซเชียลมีเดีย">
              <SocialLink href={CONTACT_INFO.facebook} label="Facebook">
                <span className="text-xs font-bold">f</span>
              </SocialLink>
              <SocialLink href={CONTACT_INFO.instagram} label="Instagram">
                <span className="text-xs font-bold">IG</span>
              </SocialLink>
              <SocialLink href={CONTACT_INFO.lineHref} label="LINE">
                <MessageCircle className="size-4" />
              </SocialLink>
              <SocialLink href={CONTACT_INFO.tiktok} label="TikTok">
                <span className="text-xs font-semibold">TT</span>
              </SocialLink>
            </div>
          </div>

          {/* Tutors / Subjects */}
          <FooterColumn title="ติวเตอร์">
            <FooterLink href="/tutors">รายวิชาที่เปิดสอน</FooterLink>
            <FooterLink href="/find-tutor">หาครูสอนพิเศษ</FooterLink>
            <FooterLink href="/join-with-us">สมัครเป็นติวเตอร์</FooterLink>
            <FooterLink href="/review">รีวิวจากนักเรียน</FooterLink>
          </FooterColumn>

          {/* Subject links for SEO */}
          <FooterColumn title="หมวดวิชา">
            {MOCK_ALL_CATEGORIES.slice(0, 6).map((subject) => (
              <FooterLink key={subject.slug} href={`/subject/${subject.slug}`}>
                {subject.name}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="ติดต่อเรา">
            <li className="flex items-start gap-2 text-sm text-[color:var(--color-body)]">
              <Phone className="mt-1 size-4 text-[color:var(--color-primary)]" />
              <a href={CONTACT_INFO.phoneHref} className="hover:text-[color:var(--color-primary)]">
                {CONTACT_INFO.phone}
              </a>
            </li>
            <li className="flex items-start gap-2 text-sm text-[color:var(--color-body)]">
              <Mail className="mt-1 size-4 text-[color:var(--color-primary)]" />
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="break-all hover:text-[color:var(--color-primary)]"
              >
                {CONTACT_INFO.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-sm text-[color:var(--color-body)]">
              <MessageCircle className="mt-1 size-4 text-[color:var(--color-primary)]" />
              <a
                href={CONTACT_INFO.lineHref}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-[color:var(--color-primary)]"
              >
                LINE: {CONTACT_INFO.lineId}
              </a>
            </li>
            <li className="flex items-start gap-2 text-sm text-[color:var(--color-body)]">
              <MapPin className="mt-1 size-4 text-[color:var(--color-primary)]" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[color:var(--color-body)]">
              <Clock className="mt-1 size-4 text-[color:var(--color-primary)]" />
              <span>{CONTACT_INFO.workDays}</span>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--color-border)] pt-6 text-xs text-[color:var(--color-muted)] md:flex-row">
          <p>© {year} Best Tutor Thailand. สงวนลิขสิทธิ์.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-[color:var(--color-primary)]">
              บทความ
            </Link>
            <Link href="/review" className="hover:text-[color:var(--color-primary)]">
              รีวิว
            </Link>
            <Link href="/find-tutor" className="hover:text-[color:var(--color-primary)]">
              หาครู
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
        {title}
      </h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-primary)]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
    >
      {children}
    </a>
  );
}

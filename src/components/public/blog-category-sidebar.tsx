import Link from "next/link";
import { ArrowRight, BookOpen, FolderOpen, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CONTACT_INFO } from "./mock-data";
import { BLOG_CATEGORIES } from "./mock-articles";

interface BlogCategorySidebarProps {
  /** Current category slug — `null` means "ทั้งหมด" is active. */
  activeSlug: string | null;
  /** Precomputed article count per category. */
  counts: Record<string, number>;
  /** Total article count — rendered next to the "All" link. */
  total: number;
  className?: string;
}

/**
 * Left-column category navigation for the blog listing pages. Desktop
 * renders as a card; on mobile callers typically swap this with horizontal
 * chips (see the page wrappers for the mobile alternative).
 */
export function BlogCategorySidebar({
  activeSlug,
  counts,
  total,
  className,
}: BlogCategorySidebarProps) {
  return (
    <aside className={["flex flex-col gap-4", className ?? ""].join(" ")}>
      <CategoriesCard activeSlug={activeSlug} counts={counts} total={total} />
      <FindTutorCta />
    </aside>
  );
}

function CategoriesCard({
  activeSlug,
  counts,
  total,
}: {
  activeSlug: string | null;
  counts: Record<string, number>;
  total: number;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[color:var(--color-heading)]">
        <FolderOpen className="size-4 text-[color:var(--color-primary)]" />
        หมวดหมู่บทความ
      </div>
      <ul className="space-y-1 text-sm">
        <li>
          <CategoryLink
            href="/blog"
            label="บทความทั้งหมด"
            count={total}
            isActive={activeSlug === null}
          />
        </li>
        {BLOG_CATEGORIES.map((category) => {
          const count = counts[category.slug] ?? 0;
          if (count === 0 && activeSlug !== category.slug) return null;
          return (
            <li key={category.slug}>
              <CategoryLink
                href={`/blog/${category.slug}`}
                label={category.name}
                count={count}
                isActive={activeSlug === category.slug}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CategoryLink({
  href,
  label,
  count,
  isActive,
}: {
  href: string;
  label: string;
  count: number;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
        isActive
          ? "bg-[color:var(--color-light-bg)] font-semibold text-[color:var(--color-primary)]"
          : "text-[color:var(--color-body)] hover:bg-[color:var(--color-alt-bg)] hover:text-[color:var(--color-primary)]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "min-w-[1.75rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold",
          isActive
            ? "bg-[color:var(--color-primary)] text-white"
            : "bg-[color:var(--color-alt-bg)] text-[color:var(--color-muted)]",
        ].join(" ")}
      >
        {count.toLocaleString("th-TH")}
      </span>
    </Link>
  );
}

function FindTutorCta() {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-primary)]/15 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] p-5 text-white shadow-md">
      <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
        <BookOpen className="size-3.5" />
        บริการของเรา
      </div>
      <h3 className="text-base font-bold leading-snug">
        ค้นหาติวเตอร์คุณภาพ 500+ คน
      </h3>
      <p className="mt-2 text-xs leading-5 text-white/90">
        จับคู่ครูสอนพิเศษตัวต่อตัวที่เหมาะกับคุณภายใน 24 ชั่วโมง ฟรี ไม่มีค่าใช้จ่าย
      </p>
      <Button
        asChild
        size="sm"
        className="mt-4 w-full bg-[color:var(--color-cta)] font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
      >
        <Link href="/find-tutor">
          หาครูสอนพิเศษ
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="mt-2 w-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
      >
        <a href={CONTACT_INFO.phoneHref}>
          <Phone className="size-3.5" />
          {CONTACT_INFO.phone}
        </a>
      </Button>
    </div>
  );
}

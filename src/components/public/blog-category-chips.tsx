import Link from "next/link";

import { BLOG_CATEGORIES } from "./mock-articles";

interface BlogCategoryChipsProps {
  /** Current category slug — `null` renders the "ทั้งหมด" chip active. */
  activeSlug: string | null;
  counts: Record<string, number>;
  total: number;
  className?: string;
}

/**
 * Horizontally-scrollable category chips for mobile blog pages. Renders
 * roughly the same information as the sidebar but in a compact form that
 * doesn't consume the viewport's entire height on phones.
 */
export function BlogCategoryChips({
  activeSlug,
  counts,
  total,
  className,
}: BlogCategoryChipsProps) {
  const items = [
    {
      slug: null as string | null,
      label: "ทั้งหมด",
      count: total,
      href: "/blog",
    },
    ...BLOG_CATEGORIES.map((category) => ({
      slug: category.slug as string | null,
      label: category.name,
      count: counts[category.slug] ?? 0,
      href: `/blog/${category.slug}`,
    })),
  ].filter(
    (item) => item.count > 0 || item.slug === activeSlug || item.slug === null,
  );

  return (
    <nav
      aria-label="เลือกหมวดหมู่บทความ"
      className={["-mx-4 overflow-x-auto px-4 pb-1 lg:hidden", className ?? ""].join(" ")}
    >
      <ul className="flex min-w-max gap-2">
        {items.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                    : "border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]",
                ].join(" ")}
              >
                {item.label}
                <span
                  className={[
                    "rounded-full px-1.5 py-px text-[11px] font-semibold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[color:var(--color-alt-bg)] text-[color:var(--color-muted)]",
                  ].join(" ")}
                >
                  {item.count.toLocaleString("th-TH")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

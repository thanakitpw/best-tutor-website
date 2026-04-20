"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: readonly TocItem[];
  /** Label for screen readers + visible title. */
  label?: string;
  className?: string;
}

/**
 * Sticky table-of-contents sidebar. Tracks the currently-visible heading via
 * IntersectionObserver so long-scroll articles keep context. Hides itself if
 * fewer than 3 headings — not worth the vertical space.
 *
 * Keep it client-only; the observer + scroll-to-click both require `window`.
 */
export function TableOfContents({
  items,
  label = "สารบัญ",
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the highest heading currently in view. Fallback to last
        // intersecting heading if multiple are in view at once.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0]!.target.id);
        }
      },
      {
        // Trigger when heading enters the top 25% of the viewport.
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update hash without triggering another scroll.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
    setActiveId(id);
  };

  return (
    <nav
      aria-label={label}
      className={[
        "rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--color-heading)]">
        <List className="size-4 text-[color:var(--color-primary)]" />
        {label}
      </div>
      <ol className="space-y-2 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={item.level === 3 ? "pl-4" : ""}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "block border-l-2 py-1 pl-3 leading-snug transition-colors",
                  isActive
                    ? "border-[color:var(--color-primary)] font-semibold text-[color:var(--color-primary)]"
                    : "border-transparent text-[color:var(--color-muted)] hover:border-[color:var(--color-primary)]/40 hover:text-[color:var(--color-heading)]",
                  item.level === 2 ? "font-medium" : "text-[13px]",
                ].join(" ")}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

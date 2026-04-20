"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max numbered buttons to render. Excess collapses into "…". */
  siblingCount?: number;
  className?: string;
}

/**
 * Accessible pagination strip. Renders at most ~7 buttons at a time:
 *
 *   « 1 … 4 5 6 … 12 »
 *
 * Consumer owns state — we call `onPageChange` with the next page index
 * (1-based) and expect the caller to update URL params + scroll.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="ตัวเลือกหน้า"
      className={["flex items-center justify-center gap-1", className ?? ""].join(" ")}
    >
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="หน้าก่อนหน้า"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden
            className="px-2 text-sm text-[color:var(--color-muted)]"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            type="button"
            size="icon-sm"
            variant={p === currentPage ? "default" : "outline"}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className="min-w-8"
          >
            {p.toLocaleString("th-TH")}
          </Button>
        ),
      )}

      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="หน้าถัดไป"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

type Token = number | "…";

function buildPageList(
  current: number,
  total: number,
  siblings: number,
): Token[] {
  // Always show first + last + current ± siblings. Collapse gaps with "…".
  const totalNumbers = siblings * 2 + 5; // first, last, current, 2 siblings, 2 dots
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, total - 1);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  const tokens: Token[] = [1];
  if (showLeftDots) tokens.push("…");
  for (let i = leftSibling; i <= rightSibling; i++) tokens.push(i);
  if (showRightDots) tokens.push("…");
  tokens.push(total);
  return tokens;
}

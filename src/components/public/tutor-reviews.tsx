"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ImageIcon,
  MessageSquareReply,
  PencilLine,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  RatingStats,
  ReviewItem,
} from "@/components/public/mock-reviews";

interface TutorReviewsProps {
  tutorSlug: string;
  tutorDisplayName: string;
  reviews: ReviewItem[];
  stats: RatingStats;
}

type FilterKey = "all" | "5" | "4" | "with-photos" | "with-reply";
type SortKey = "newest" | "highest" | "lowest";

const FILTER_OPTIONS: readonly { key: FilterKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "5", label: "5 ดาว" },
  { key: "4", label: "4 ดาว" },
  { key: "with-photos", label: "มีรูป" },
  { key: "with-reply", label: "มีคำตอบจากร้าน" },
] as const;

const PAGE_SIZE = 5;

/**
 * Shopee-style reviews section for `/tutor/[slug]`.
 *
 * This is the critical differentiator from the old WordPress site — it is
 * intentionally the most detailed component on the profile page:
 *   • Top summary (big number + star bar distribution) — matches Shopee,
 *     Airbnb, Booking.com so users recognise the pattern instantly.
 *   • Filter chips + sort dropdown — lets Lead-ready visitors skim the
 *     relevant reviews quickly (e.g. "show me 5-star reviews with photos").
 *   • Admin reply card — brand trust signal; the old site had no way for ops
 *     to respond publicly.
 *
 * Data is currently mock; once Phase 8 seeds real reviews through Admin CMS,
 * this component will receive real rows via `GetTutorBySlugResponse`.
 */
export function TutorReviews({
  tutorSlug,
  tutorDisplayName,
  reviews,
  stats,
}: TutorReviewsProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const filteredList = reviews.filter((r) => {
      switch (filter) {
        case "5":
          return r.rating === 5;
        case "4":
          return r.rating === 4;
        case "with-photos":
          return r.images.length > 0;
        case "with-reply":
          return Boolean(r.adminReply);
        case "all":
        default:
          return true;
      }
    });

    return filteredList.sort((a, b) => {
      switch (sort) {
        case "highest":
          return b.rating - a.rating || b.createdAt.getTime() - a.createdAt.getTime();
        case "lowest":
          return a.rating - b.rating || b.createdAt.getTime() - a.createdAt.getTime();
        case "newest":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [filter, sort, reviews]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  // Reset pagination when filter/sort changes so the user always sees the
  // top of the filtered list first.
  function handleFilterChange(next: FilterKey) {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
  }

  function handleSortChange(next: SortKey) {
    setSort(next);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary card */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-6 md:grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] md:items-center">
          {/* Left — big number */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-[color:var(--color-heading)] md:text-6xl">
                {stats.total > 0 ? stats.average.toFixed(1) : "—"}
              </span>
              <span className="text-lg font-medium text-[color:var(--color-muted)]">
                / 5
              </span>
            </div>
            <StarRow rating={Math.round(stats.average)} size="lg" />
            <p className="text-sm text-[color:var(--color-muted)]">
              จากทั้งหมด {stats.total.toLocaleString("th-TH")} รีวิว
            </p>
          </div>

          {/* Right — distribution */}
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5];
              const pct = stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);
              return (
                <div key={star} className="grid grid-cols-[48px_1fr_56px] items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-medium text-[color:var(--color-body)]">
                    {star}
                    <Star className="size-3.5 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]" />
                  </span>
                  <Progress
                    value={pct}
                    className="h-2 bg-[color:var(--color-light-bg)] [&>[data-slot=progress-indicator]]:bg-[color:var(--color-cta)]"
                  />
                  <span className="text-right text-xs text-[color:var(--color-muted)]">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write review CTA */}
        <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-heading)]">
              เคยเรียนกับ {tutorDisplayName}?
            </p>
            <p className="text-xs text-[color:var(--color-muted)]">
              แบ่งปันประสบการณ์ให้ผู้ปกครองท่านอื่นเห็น
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[color:var(--color-primary)]/30 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/5"
          >
            <Link href={`/review?tutor=${encodeURIComponent(tutorSlug)}`}>
              <PencilLine className="size-4" />
              เขียนรีวิว
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="กรองรีวิว"
        >
          {FILTER_OPTIONS.map((opt) => {
            const active = opt.key === filter;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleFilterChange(opt.key)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium transition-colors",
                  active
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                    : "border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]/40 hover:text-[color:var(--color-primary)]",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="review-sort"
            className="text-xs text-[color:var(--color-muted)]"
          >
            เรียงตาม
          </label>
          <Select
            value={sort}
            onValueChange={(v) => handleSortChange(v as SortKey)}
          >
            <SelectTrigger
              id="review-sort"
              className="h-9 min-w-[140px] bg-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">ล่าสุด</SelectItem>
              <SelectItem value="highest">คะแนนสูง</SelectItem>
              <SelectItem value="lowest">คะแนนต่ำ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-4">
        {visible.length === 0 ? (
          <EmptyReviewState />
        ) : (
          visible.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="h-11 min-w-[220px] border-[color:var(--color-border)]"
          >
            <ChevronDown className="size-4" />
            ดูรีวิวเพิ่มเติม ({filtered.length - visible.length})
          </Button>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components --------------------------------------------------------

function ReviewCard({ review }: { review: ReviewItem }) {
  const initials = review.reviewerName.replace(/^คุณ|^น้อง/, "").slice(0, 2);
  const dateLabel = formatThaiShortDate(review.createdAt);

  return (
    <article className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-sm font-semibold text-white"
          >
            {initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                {review.reviewerName}
              </span>
              {review.isVerified && (
                <span
                  title="ผู้เรียนที่ยืนยันแล้ว"
                  className="inline-flex items-center gap-0.5 text-xs text-[color:var(--color-success)]"
                >
                  <ShieldCheck className="size-3.5" />
                </span>
              )}
            </div>
            <time
              dateTime={review.createdAt.toISOString()}
              className="text-xs text-[color:var(--color-muted)]"
            >
              {dateLabel}
            </time>
          </div>
        </div>
        <StarRow rating={review.rating} size="md" />
      </header>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--color-body)]">
        {review.comment}
      </p>

      {review.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.images.map((url, idx) => (
            <ReviewImage
              key={`${review.id}-${idx}`}
              url={url}
              alt={`รูปประกอบรีวิวจาก ${review.reviewerName} รูปที่ ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {review.adminReply && (
        <div className="mt-4 rounded-xl bg-[color:var(--color-primary)]/5 p-4 ring-1 ring-[color:var(--color-primary)]/10">
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-primary)]">
            <MessageSquareReply className="size-3.5" />
            ตอบกลับจาก Best Tutor Thailand
          </div>
          <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--color-body)]">
            {review.adminReply}
          </p>
        </div>
      )}
    </article>
  );
}

function ReviewImage({ url, alt }: { url: string; alt: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`ดูรูป: ${alt}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-[color:var(--color-border)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] sm:h-24 sm:w-24"
        >
          <Image
            src={url}
            alt={alt}
            fill
            sizes="96px"
            className="object-cover"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full sm:aspect-[4/3]">
          <Image src={url} alt={alt} fill sizes="(min-width: 768px) 720px, 95vw" className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyReviewState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-light-bg)]/40 px-6 py-12 text-center">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <ImageIcon className="size-5 text-[color:var(--color-muted)]" />
      </span>
      <div>
        <p className="text-sm font-semibold text-[color:var(--color-heading)]">
          ยังไม่มีรีวิวที่ตรงกับตัวกรอง
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          ลองปรับตัวกรองด้านบน หรือเขียนรีวิวเป็นคนแรก
        </p>
      </div>
    </div>
  );
}

function StarRow({
  rating,
  size,
}: {
  rating: number;
  size: "md" | "lg";
}) {
  const iconClass = size === "lg" ? "size-5" : "size-4";
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`คะแนน ${rating} จาก 5 ดาว`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            iconClass,
            i <= rating
              ? "fill-[color:var(--color-cta)] text-[color:var(--color-cta)]"
              : "text-[color:var(--color-border)]",
          )}
        />
      ))}
    </div>
  );
}

// ---- Utilities -------------------------------------------------------------

/** Format date like "15 มี.ค. 67" — Thai Buddhist year, short month. */
function formatThaiShortDate(date: Date): string {
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const buddhistYear = (date.getFullYear() + 543) % 100;
  return `${day} ${month} ${buddhistYear.toString().padStart(2, "0")}`;
}

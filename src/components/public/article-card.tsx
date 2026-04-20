import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string | null;
  category: string;
  publishedAt: string;
  readTimeMinutes?: number;
  imageAlt?: string;
  /** Fallback accent background when no image is available */
  accentColor?: string;
}

interface ArticleCardProps {
  article: ArticleCardData;
  /** "feature" = large hero layout used on homepage highlight */
  variant?: "default" | "feature";
  className?: string;
}

const THAI_DATE_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Article card for /blog listings and homepage preview.
 * Supports a hero "feature" variant for the editor's top pick.
 */
export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const {
    slug,
    title,
    excerpt,
    featuredImageUrl,
    category,
    publishedAt,
    readTimeMinutes,
    imageAlt,
    accentColor,
  } = article;
  const href = `/blog/${slug}`;
  const formattedDate = formatDate(publishedAt);

  if (variant === "feature") {
    return (
      <article
        className={[
          "group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-sm transition-all hover:shadow-md md:flex-row",
          className ?? "",
        ].join(" ")}
      >
        <Link
          href={href}
          className="relative block aspect-[16/9] w-full overflow-hidden md:aspect-auto md:w-1/2"
          aria-label={`อ่านบทความ ${title}`}
        >
          <ArticleImage
            src={featuredImageUrl}
            alt={imageAlt ?? title}
            accentColor={accentColor}
          />
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
          <Badge variant="secondary" className="self-start bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]">
            {category}
          </Badge>
          <Link href={href}>
            <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[color:var(--color-heading)] transition-colors group-hover:text-[color:var(--color-primary)] md:text-2xl">
              {title}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm leading-6 text-[color:var(--color-muted)]">
            {excerpt}
          </p>
          <MetaRow date={formattedDate} readTime={readTimeMinutes} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={[
        "group flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className ?? "",
      ].join(" ")}
    >
      <Link
        href={href}
        className="relative block aspect-[16/9] overflow-hidden"
        aria-label={`อ่านบทความ ${title}`}
      >
        <ArticleImage
          src={featuredImageUrl}
          alt={imageAlt ?? title}
          accentColor={accentColor}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge
          variant="secondary"
          className="self-start bg-[color:var(--color-light-bg)] text-xs text-[color:var(--color-primary)]"
        >
          {category}
        </Badge>
        <Link href={href} className="flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[color:var(--color-heading)] transition-colors group-hover:text-[color:var(--color-primary)]">
            {title}
          </h3>
        </Link>
        <p className="line-clamp-3 text-xs leading-5 text-[color:var(--color-muted)]">
          {excerpt}
        </p>
        <MetaRow date={formattedDate} readTime={readTimeMinutes} />
      </div>
    </article>
  );
}

function ArticleImage({
  src,
  alt,
  accentColor,
}: {
  src: string | null | undefined;
  alt: string;
  accentColor?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center text-sm font-medium text-[color:var(--color-heading)]/50"
      style={{ background: accentColor ?? "var(--color-light-bg)" }}
    >
      <span className="rounded-md bg-white/70 px-3 py-1 text-xs font-semibold">
        Best Tutor
      </span>
    </div>
  );
}

function MetaRow({ date, readTime }: { date: string; readTime?: number }) {
  return (
    <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-[color:var(--color-muted)]">
      <time dateTime={date}>{date}</time>
      {typeof readTime === "number" && (
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {readTime} นาที
        </span>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return THAI_DATE_FORMATTER.format(date);
}

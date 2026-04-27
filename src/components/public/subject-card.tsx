import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Dumbbell,
  Globe2,
  Languages,
  Microscope,
  Monitor,
  Music,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface SubjectCardData {
  slug: string;
  name: string;
  iconName?:
    | "Languages"
    | "Calculator"
    | "Microscope"
    | "BookOpen"
    | "Globe2"
    | "Monitor"
    | "Palette"
    | "Music"
    | "Dumbbell"
    | "Sparkles";
  tutorCount?: number;
  tagline?: string;
}

interface SubjectCardProps {
  subject: SubjectCardData;
  /** Override destination — defaults to /subject/[slug] */
  href?: string;
  className?: string;
  /**
   * Compact variant renders a 56×56 colored thumbnail on top + centered label.
   * Used on the homepage Popular Subjects row. Defaults to the full tagline card.
   */
  variant?: "default" | "thumbnail";
}

const ICON_MAP: Record<NonNullable<SubjectCardData["iconName"]>, LucideIcon> = {
  Languages,
  Calculator,
  Microscope,
  BookOpen,
  Globe2,
  Monitor,
  Palette,
  Music,
  Dumbbell,
  Sparkles,
};

/**
 * Per-subject accent for the 56×56 thumbnail tile — soft pastel bg + vivid icon.
 * Keeps a friendly, varied look before real Paper photos are wired up.
 */
const THUMB_THEME: Record<string, { bg: string; fg: string }> = {
  thai: { bg: "#FEF3C7", fg: "#B45309" },
  social: { bg: "#DCFCE7", fg: "#047857" },
  math: { bg: "#DBEAFE", fg: "#046BD2" },
  science: { bg: "#FCE7F3", fg: "#BE185D" },
  language: { bg: "#EDE9FE", fg: "#6D28D9" },
  english: { bg: "#EDE9FE", fg: "#6D28D9" },
  chinese: { bg: "#FEE2E2", fg: "#B91C1C" },
  computer: { bg: "#E0F2FE", fg: "#0369A1" },
  art: { bg: "#FFE4E6", fg: "#BE123C" },
  music: { bg: "#F3E8FF", fg: "#7E22CE" },
  sport: { bg: "#D1FAE5", fg: "#047857" },
};
const THUMB_FALLBACK = { bg: "#DBEAFE", fg: "#046BD2" };

/**
 * Subject category card used on the homepage grid and /tutors page.
 * - variant="thumbnail": compact, centered, with a colored icon tile on top (homepage)
 * - variant="default": roomier card with tagline + tutor count (used on /tutors)
 */
export function SubjectCard({
  subject,
  href,
  className,
  variant = "default",
}: SubjectCardProps) {
  const { slug, name, iconName = "Sparkles", tutorCount, tagline } = subject;
  const Icon = ICON_MAP[iconName];
  const destination = href ?? `/subject/${slug}`;

  if (variant === "thumbnail") {
    const theme = THUMB_THEME[slug] ?? THUMB_FALLBACK;
    return (
      <Link
        href={destination}
        className={[
          "group flex flex-col items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40",
          className ?? "",
        ].join(" ")}
        aria-label={`ดูติวเตอร์วิชา${name}`}
      >
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-lg"
          style={{ backgroundColor: theme.bg, color: theme.fg }}
        >
          <Icon className="size-7" />
        </span>
        <h3 className="text-sm font-semibold text-[color:var(--color-heading)] md:text-base">
          {name}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      href={destination}
      className={[
        "group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40",
        className ?? "",
      ].join(" ")}
      aria-label={`ดูติวเตอร์วิชา${name}`}
    >
      {/* Icon badge */}
      <div className="flex items-center justify-between">
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-xl bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)] transition-colors group-hover:bg-[color:var(--color-primary)] group-hover:text-white"
        >
          <Icon className="size-6" />
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[color:var(--color-heading)]">
          {name}
        </h3>
        {tagline && (
          <p className="line-clamp-2 text-xs text-[color:var(--color-muted)]">
            {tagline}
          </p>
        )}
      </div>

      {typeof tutorCount === "number" && (
        <span className="text-xs font-medium text-[color:var(--color-primary)]">
          {tutorCount.toLocaleString("th-TH")} ติวเตอร์
        </span>
      )}
    </Link>
  );
}

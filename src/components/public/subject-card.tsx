import Link from "next/link";
import {
  ArrowUpRight,
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
 * Subject category card used on the homepage grid and /tutors page.
 * Hover reveals a subtle accent border + arrow to telegraph the tap target.
 */
export function SubjectCard({ subject, href, className }: SubjectCardProps) {
  const { slug, name, iconName = "Sparkles", tutorCount, tagline } = subject;
  const Icon = ICON_MAP[iconName];
  const destination = href ?? `/subject/${slug}`;

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
        <ArrowUpRight
          aria-hidden
          className="size-4 text-[color:var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--color-primary)]"
        />
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

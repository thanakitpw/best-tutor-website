import Link from "next/link";
import Image from "next/image";
import { MapPin, MessageCircle, Star, Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/components/public/mock-data";

export interface TutorCardData {
  slug: string;
  nickname: string;
  firstName: string;
  lastName?: string;
  profileImageUrl: string | null;
  rating: number;
  reviewCount: number;
  subjects: string[];
  province?: string | null;
  education?: string | null;
  isPopular?: boolean;
}

interface TutorCardProps {
  tutor: TutorCardData;
  /** Card size — use "compact" on tight grids (4+ cols) */
  size?: "default" | "compact";
  className?: string;
}

/**
 * TutorCard — the single most important card on the site.
 *
 * Unlike the old WordPress site (photo + name only), this card surfaces:
 *   • rating + review count (social proof)
 *   • subjects taught (keyword match for user search intent)
 *   • rate (reduces friction before clicking)
 *   • location (filters implicit geo intent)
 *   • "ยอดนิยม" badge for popular tutors
 *
 * Intentional deviation from old design noted in docs/ux-ui-analysis.md §3.
 */
export function TutorCard({ tutor, size = "default", className }: TutorCardProps) {
  const {
    slug,
    nickname,
    firstName,
    lastName,
    profileImageUrl,
    rating,
    reviewCount,
    subjects,
    province,
    education,
    isPopular,
  } = tutor;

  const displayName = `${nickname} ${firstName}${lastName ? ` ${lastName}` : ""}`.trim();
  const initials = (nickname.replace(/^ครู/, "").trim() || firstName).slice(0, 2);
  const visibleSubjects = subjects.slice(0, 3);
  const extraSubjectsCount = Math.max(0, subjects.length - visibleSubjects.length);
  const profileUrl = `/tutor/${slug}`;

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md",
        className ?? "",
      ].join(" ")}
    >
      {/* Popular badge — top-left overlay */}
      {isPopular && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[color:var(--color-cta)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-heading)] shadow-sm">
          <Crown className="size-3" />
          ยอดนิยม
        </span>
      )}

      {/* Photo — primary link to profile */}
      <Link
        href={profileUrl}
        className="relative block aspect-[4/5] overflow-hidden bg-[color:var(--color-light-bg)]"
        aria-label={`ดูโปรไฟล์ ${displayName}`}
      >
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`รูปโปรไฟล์ ${displayName}`}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
            className="rounded-[15px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder initials={initials} />
        )}
      </Link>

      <div className={`flex flex-1 flex-col gap-2 ${size === "compact" ? "p-3" : "p-4"}`}>
        {/* Rating row */}
        <div className="flex items-center gap-1.5 text-xs">
          <Star className="size-3.5 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]" />
          <span className="font-semibold text-[color:var(--color-heading)]">
            {rating.toFixed(1)}
          </span>
          <span className="text-[color:var(--color-muted)]">({reviewCount} รีวิว)</span>
        </div>

        {/* Name */}
        <Link
          href={profileUrl}
          className="text-base font-semibold leading-snug text-[color:var(--color-heading)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          {displayName}
        </Link>

        {/* Education */}
        {education && (
          <p className="line-clamp-1 text-xs text-[color:var(--color-muted)]">
            {education}
          </p>
        )}

        {/* Subjects */}
        <div className="flex flex-wrap gap-1">
          {visibleSubjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="bg-[color:var(--color-light-bg)] text-[11px] font-medium text-[color:var(--color-primary)]"
            >
              {subject}
            </Badge>
          ))}
          {extraSubjectsCount > 0 && (
            <Badge
              variant="outline"
              className="border-[color:var(--color-border)] text-[11px] font-medium text-[color:var(--color-muted)]"
            >
              +{extraSubjectsCount}
            </Badge>
          )}
        </div>

        {/* Meta: location */}
        {province && (
          <div className="mt-auto flex items-center pt-2 text-xs">
            <span className="flex items-center gap-1 text-[color:var(--color-muted)]">
              <MapPin className="size-3" />
              {province}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex gap-2">
          <Button asChild size="sm" className="h-9 flex-1">
            <Link href={profileUrl}>ดูโปรไฟล์</Link>
          </Button>
          <Button
            asChild
            size="icon-sm"
            variant="outline"
            className="h-9 w-9 border-[color:var(--color-success)]/30 text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10"
            aria-label={`แชท LINE ${displayName}`}
          >
            <a href={CONTACT_INFO.lineHref} target="_blank" rel="noreferrer noopener">
              <MessageCircle className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * Gradient avatar fallback — used when no Cloudinary URL is seeded yet.
 * Keeps visual parity with real photos without blocking on image hosts.
 */
function PhotoPlaceholder({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-primary-dark)] text-4xl font-bold text-white"
    >
      {initials}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import type { MockTutor } from "./mock-data";

interface FeaturedTutorAvatarProps {
  tutor: MockTutor;
  /** Stars rating (1-5). Defaults to 5 to match the Paper hero row. */
  displayStars?: number;
}

/** Gradient palette used when tutor has no profile image — cycles by initial. */
const INITIAL_GRADIENTS = [
  "from-[#6366F1] to-[#8B5CF6]",
  "from-[#0693E3] to-[#046BD2]",
  "from-[#F472B6] to-[#BE185D]",
  "from-[#34D399] to-[#047857]",
  "from-[#F59E0B] to-[#B45309]",
  "from-[#60A5FA] to-[#0369A1]",
];

/**
 * Homepage "Popular Tutors" circular avatar with a gold ring + 5-star row.
 * Separate from TutorCard because the /tutors list needs the full data-dense
 * card while the homepage row prioritizes a warm, friendly first impression.
 */
export function FeaturedTutorAvatar({
  tutor,
  displayStars = 5,
}: FeaturedTutorAvatarProps) {
  const initial = tutor.nickname.replace(/^ครู/, "").slice(0, 1) || "T";
  const gradient =
    INITIAL_GRADIENTS[initial.charCodeAt(0) % INITIAL_GRADIENTS.length];

  return (
    <Link
      href={`/tutor/${tutor.slug}`}
      className="group flex flex-col items-center gap-3 focus-visible:outline-none"
      aria-label={`ดูโปรไฟล์${tutor.nickname}`}
    >
      <span
        className="relative flex size-[140px] items-center justify-center overflow-hidden rounded-full ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[color:var(--color-primary)] transition-transform group-hover:scale-[1.03]"
      >
        {tutor.profileImageUrl ? (
          <Image
            src={tutor.profileImageUrl}
            alt={`รูปโปรไฟล์${tutor.nickname}`}
            fill
            sizes="140px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient} text-3xl font-bold text-white`}
          >
            {initial}
          </span>
        )}
      </span>

      <p className="text-base font-semibold text-white md:text-lg">
        {tutor.nickname}
      </p>

      <span
        className="flex items-center gap-0.5"
        aria-label={`คะแนน ${displayStars} จาก 5 ดาว`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden
            className={
              i < displayStars
                ? "size-4 fill-[#FFB800] text-[#FFB800]"
                : "size-4 text-white/40"
            }
          />
        ))}
      </span>
    </Link>
  );
}

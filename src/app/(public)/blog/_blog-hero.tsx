import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: React.ReactNode;
  /** Small stat rendered under the description — e.g. article count. */
  stat?: string;
}

/**
 * Shared hero used by `/blog` and `/blog/[category]` pages. Keeps the blue
 * brand banner consistent and guarantees the H1 + breadcrumb slot live in
 * the same visual container.
 */
export function BlogHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  stat,
}: BlogHeroProps) {
  return (
    <section
      aria-label={title}
      className="relative overflow-hidden bg-[color:var(--color-primary)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary-dark)]/90 via-[color:var(--color-primary)]/85 to-[color:var(--color-accent)]/75" />
      <div className="relative mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 md:py-16">
        <div className="mb-5">{breadcrumb}</div>
        <div className="flex flex-col gap-4 text-white md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge
              variant="secondary"
              className="self-start bg-white/15 text-white backdrop-blur hover:bg-white/20"
            >
              <BookOpen className="size-3.5" />
              {eyebrow}
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {title}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/85 md:text-base">
              {description}
            </p>
            {stat && <p className="text-xs text-white/70">{stat}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 md:pb-1">
            <Button
              asChild
              size="lg"
              className="bg-[color:var(--color-cta)] font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
            >
              <Link href="/find-tutor">
                หาครูสอนพิเศษ
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/tutors">ดูรายวิชาทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Sparkles, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BlogInlineCtaProps {
  className?: string;
  /** Optional headline override — defaults to generic lead-gen prompt. */
  title?: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
}

/**
 * Attention-grabbing CTA rendered after the first H2 in long-form articles.
 * Its sole job is to convert readers who are already engaged into leads.
 * Server component by design — no interactivity, avoids client bundle bloat.
 */
export function BlogInlineCta({
  className,
  title = "กำลังหาครูสอนพิเศษอยู่ใช่ไหม?",
  description = "เรามีติวเตอร์คุณภาพกว่า 500 คน รีวิวจริง ราคาโปร่งใส จับคู่ให้ภายใน 24 ชม.",
  ctaLabel = "หาครูสอนพิเศษ",
  href = "/find-tutor",
}: BlogInlineCtaProps) {
  return (
    <aside
      aria-label="แนะนำบริการ Best Tutor"
      className={[
        "my-8 overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/15 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] p-6 text-white shadow-md",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white md:flex">
            <Users2 className="size-6" />
          </span>
          <div>
            <p className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
              <Sparkles className="size-3.5" />
              บริการแนะนำ
            </p>
            <h3 className="text-lg font-bold leading-tight md:text-xl">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-white/90">{description}</p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 bg-[color:var(--color-cta)] font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
        >
          <Link href={href} aria-label={ctaLabel}>
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}

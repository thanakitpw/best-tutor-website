"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";

import { CONTACT_INFO } from "@/components/public/mock-data";

/**
 * Floating CTA cluster — pinned bottom-right on desktop/tablet, becomes a
 * full-width bottom bar on mobile. Not shown on admin routes.
 *
 * Critical for Lead-Gen per docs/ux-ui-analysis.md — gives mobile users a
 * one-tap path to LINE or phone from every public page.
 */
export function StickyCta() {
  const pathname = usePathname() ?? "/";

  // Hide on admin or non-public internal routes.
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Desktop / tablet — floating cluster */}
      <div
        aria-label="ช่องทางติดต่อด่วน"
        className="fixed right-4 bottom-4 z-50 hidden flex-col items-end gap-2 md:flex"
      >
        <a
          href={CONTACT_INFO.lineHref}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-success)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <MessageCircle className="size-4" />
          แชท LINE
        </a>
        <a
          href={CONTACT_INFO.phoneHref}
          className="group flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <Phone className="size-4" />
          โทร {CONTACT_INFO.phone}
        </a>
      </div>

      {/* Mobile — bottom bar with two equal buttons. Uses safe-area inset so
          it doesn't collide with the iOS home indicator. */}
      <div
        aria-label="ช่องทางติดต่อด่วน (มือถือ)"
        className="fixed right-0 bottom-0 left-0 z-50 flex items-stretch gap-2 border-t border-[color:var(--color-border)] bg-white p-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <a
          href={CONTACT_INFO.lineHref}
          target="_blank"
          rel="noreferrer noopener"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-success)] px-3 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="size-4" />
          แชท LINE
        </a>
        <a
          href={CONTACT_INFO.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[color:var(--color-primary)] px-3 py-3 text-sm font-semibold text-white"
        >
          <Phone className="size-4" />
          โทรเลย
        </a>
      </div>

      {/* Spacer — push content up so sticky bar doesn't cover footer on mobile */}
      <div aria-hidden className="h-20 md:hidden" />
    </>
  );
}

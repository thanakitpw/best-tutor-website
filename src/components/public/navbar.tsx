import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MAIN_NAV_LINKS } from "@/components/public/mock-data";
import { MobileNav } from "@/components/public/mobile-nav";

/**
 * Public navbar — sticky, white background, brand on the left, menu center,
 * CTAs on the right. Mobile collapses to a hamburger via <MobileNav>.
 *
 * Server component by default; only the mobile Sheet ships client JS.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--color-border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Best Tutor Thailand — หน้าแรก"
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-primary)] text-lg font-bold text-white shadow-sm"
          >
            BT
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-[color:var(--color-heading)]">
              Best Tutor
            </span>
            <span className="text-[11px] font-medium text-[color:var(--color-muted)]">
              Thailand
            </span>
          </span>
        </Link>

        {/* Desktop menu */}
        <nav
          aria-label="เมนูหลัก"
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-[color:var(--color-body)] transition-colors hover:bg-[color:var(--color-light-bg)] hover:text-[color:var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm" className="h-10 px-4">
            <Link href="/join-with-us">สมัครเป็นติวเตอร์</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-10 bg-[color:var(--color-cta)] px-5 text-[color:var(--color-heading)] shadow-sm transition-colors hover:bg-[color:var(--color-cta-hover)]"
          >
            <Link href="/find-tutor">หาครูสอนพิเศษ</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <MobileNav />
      </div>
    </header>
  );
}

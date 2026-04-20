"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CONTACT_INFO, MAIN_NAV_LINKS } from "@/components/public/mock-data";

/**
 * Mobile nav — rendered only below lg breakpoint.
 * Hamburger triggers a right-side sheet with main links + both CTAs +
 * quick call button.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Button
        asChild
        size="sm"
        className="h-10 bg-[color:var(--color-cta)] px-4 text-[color:var(--color-heading)] shadow-sm hover:bg-[color:var(--color-cta-hover)]"
      >
        <Link href="/find-tutor">หาครู</Link>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            aria-label="เปิดเมนู"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] sm:w-[360px]">
          <SheetHeader className="border-b border-[color:var(--color-border)]">
            <SheetTitle className="text-left text-[color:var(--color-heading)]">
              Best Tutor Thailand
            </SheetTitle>
            <SheetDescription className="text-left text-xs">
              เป้าหมายของคุณ ความสำเร็จของเรา
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="เมนูหลัก (มือถือ)">
            {MAIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[color:var(--color-body)] hover:bg-[color:var(--color-light-bg)] hover:text-[color:var(--color-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-[color:var(--color-border)] p-4">
            <Button
              asChild
              className="h-11 w-full bg-[color:var(--color-cta)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
            >
              <Link href="/find-tutor" onClick={() => setOpen(false)}>
                หาครูสอนพิเศษ
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href="/join-with-us" onClick={() => setOpen(false)}>
                สมัครเป็นติวเตอร์
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-11 w-full justify-center gap-2">
              <a href={CONTACT_INFO.phoneHref}>
                <Phone className="size-4" />
                โทรหาเรา {CONTACT_INFO.phone}
              </a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

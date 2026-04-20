"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FilterSidebar,
  type ProvinceOption,
} from "@/components/public/filter-sidebar";

interface FilterMobileSheetProps {
  provinceOptions: readonly ProvinceOption[];
  /** Badge number on the trigger button — parent calculates from URL state. */
  activeCount: number;
  /** Optional label override. */
  triggerLabel?: string;
}

/**
 * Mobile affordance: a button that opens a bottom-to-top sheet containing the
 * full <FilterSidebar>. The sheet auto-closes after the user commits a
 * filter — wired through FilterSidebar's `onApply` callback — to keep the
 * one-handed mobile flow tight.
 */
export function FilterMobileSheet({
  provinceOptions,
  activeCount,
  triggerLabel = "ตัวกรอง",
}: FilterMobileSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          {triggerLabel}
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-1.5 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b border-[color:var(--color-border)]">
          <SheetTitle>ตัวกรองติวเตอร์</SheetTitle>
          <SheetDescription>
            เลือกเงื่อนไขที่ต้องการ ระบบจะบันทึกเป็น URL เพื่อให้บันทึกและแชร์ได้
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 pb-10">
          <FilterSidebar
            provinceOptions={provinceOptions}
            variant="sheet"
            // Keep the sheet open while tweaking — the user taps the primary
            // "ดูติวเตอร์ N คน" bottom button to dismiss.
          />
        </div>
        <div className="sticky bottom-0 border-t border-[color:var(--color-border)] bg-white p-4">
          <Button
            type="button"
            className="h-11 w-full"
            onClick={() => setOpen(false)}
          >
            ดูติวเตอร์ที่ตรงกับตัวกรอง
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

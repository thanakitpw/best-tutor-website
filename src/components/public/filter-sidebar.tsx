"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eraser, Filter, Star, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

// ---- Types & defaults ------------------------------------------------------

export interface TutorFilterState {
  /** Max price per hour (baht). 0 means "no cap". */
  maxPrice: number;
  /** Minimum teaching experience in years. 0 means "any". */
  minExperience: number;
  /** Province value — "all" or specific province label. */
  province: string;
  /** Minimum average rating. 0 means "any". */
  minRating: number;
  /** Gender — "all" or "ชาย"/"หญิง". */
  gender: string;
}

export const DEFAULT_FILTERS: TutorFilterState = {
  maxPrice: 0,
  minExperience: 0,
  province: "all",
  minRating: 0,
  gender: "all",
};

export const PRICE_MIN = 0;
export const PRICE_MAX = 2000;
export const PRICE_STEP = 50;

type FilterKey =
  | "price"
  | "exp"
  | "province"
  | "rating"
  | "gender"
  | "sort"
  | "page";

export interface ProvinceOption {
  value: string;
  label: string;
}

// ---- Parsers ---------------------------------------------------------------

/**
 * Parse URL search params → filter state. Defensive against malformed input
 * so bookmarked / shared URLs never crash the page.
 */
export function parseFiltersFromParams(
  params: URLSearchParams | ReadonlyURLSearchParams,
): TutorFilterState {
  const raw = (key: FilterKey): string | null => params.get(key);

  const priceRaw = Number(raw("price"));
  const expRaw = Number(raw("exp"));
  const ratingRaw = Number(raw("rating"));

  return {
    maxPrice:
      Number.isFinite(priceRaw) && priceRaw > 0 && priceRaw <= PRICE_MAX
        ? Math.round(priceRaw)
        : DEFAULT_FILTERS.maxPrice,
    minExperience:
      Number.isFinite(expRaw) && expRaw > 0 && expRaw <= 40
        ? Math.round(expRaw)
        : DEFAULT_FILTERS.minExperience,
    province: raw("province") ?? DEFAULT_FILTERS.province,
    minRating:
      Number.isFinite(ratingRaw) && ratingRaw > 0 && ratingRaw <= 5
        ? Number(ratingRaw.toFixed(1))
        : DEFAULT_FILTERS.minRating,
    gender: raw("gender") ?? DEFAULT_FILTERS.gender,
  };
}

// Next 15 exports `ReadonlyURLSearchParams` from `next/navigation`. Declared
// locally so this module stays decoupled from route-specific imports.
type ReadonlyURLSearchParams = ReturnType<typeof useSearchParams>;

/** Count of filters different from default — used to badge the mobile CTA. */
export function countActiveFilters(state: TutorFilterState): number {
  let n = 0;
  if (state.maxPrice !== DEFAULT_FILTERS.maxPrice) n++;
  if (state.minExperience !== DEFAULT_FILTERS.minExperience) n++;
  if (state.province !== DEFAULT_FILTERS.province) n++;
  if (state.minRating !== DEFAULT_FILTERS.minRating) n++;
  if (state.gender !== DEFAULT_FILTERS.gender) n++;
  return n;
}

/** Build a URL query string from state, omitting defaults to keep URLs clean. */
export function serializeFiltersToParams(
  state: TutorFilterState,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);
  const set = (key: FilterKey, value: string | null) => {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  };

  set(
    "price",
    state.maxPrice !== DEFAULT_FILTERS.maxPrice ? String(state.maxPrice) : null,
  );
  set(
    "exp",
    state.minExperience !== DEFAULT_FILTERS.minExperience
      ? String(state.minExperience)
      : null,
  );
  set(
    "province",
    state.province !== DEFAULT_FILTERS.province ? state.province : null,
  );
  set(
    "rating",
    state.minRating !== DEFAULT_FILTERS.minRating
      ? String(state.minRating)
      : null,
  );
  set(
    "gender",
    state.gender !== DEFAULT_FILTERS.gender ? state.gender : null,
  );
  // Any filter change resets page to 1.
  params.delete("page");
  return params;
}

// ---- Component -------------------------------------------------------------

interface FilterSidebarProps {
  /** Province dropdown source — passed from route so the list stays colocated
   * with mock data. */
  provinceOptions: readonly ProvinceOption[];
  /** "default" on desktop; "sheet" removes sticky/bordered shell when embedded
   * in <Sheet> on mobile. */
  variant?: "default" | "sheet";
  /** Fires after the URL has been pushed — parent can close a Sheet, etc. */
  onApply?: () => void;
  className?: string;
}

/**
 * URL-synchronized tutor filter.
 *
 * Design choices:
 *   • URL params are the source of truth → each filter state has a shareable
 *     URL, and the back button "just works".
 *   • Writes use router.replace (scroll: false) so the listing updates in
 *     place without scrolling the user to the top on each toggle.
 *   • Debouncing is handled at the slider commit level (onValueCommit) so we
 *     don't thrash the router while the thumb is dragging.
 */
export function FilterSidebar({
  provinceOptions,
  variant = "default",
  onApply,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );

  const commit = useCallback(
    (next: TutorFilterState) => {
      const params = serializeFiltersToParams(
        next,
        new URLSearchParams(searchParams.toString()),
      );
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url, { scroll: false });
      onApply?.();
    },
    [router, pathname, searchParams, onApply],
  );

  const update = useCallback(
    <K extends keyof TutorFilterState>(key: K, value: TutorFilterState[K]) => {
      commit({ ...filters, [key]: value });
    },
    [commit, filters],
  );

  const reset = useCallback(() => {
    commit(DEFAULT_FILTERS);
  }, [commit]);

  const activeCount = countActiveFilters(filters);
  const priceDisplay =
    filters.maxPrice === DEFAULT_FILTERS.maxPrice
      ? `฿${PRICE_MIN.toLocaleString("th-TH")} - ไม่จำกัด`
      : `฿${PRICE_MIN.toLocaleString("th-TH")} - ฿${filters.maxPrice.toLocaleString("th-TH")}`;
  const priceValue = filters.maxPrice === 0 ? PRICE_MAX : filters.maxPrice;

  const shellClassName =
    variant === "sheet"
      ? "flex flex-col gap-6"
      : [
          "sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-5 overflow-y-auto rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm",
          className ?? "",
        ].join(" ");

  return (
    <aside aria-label="ตัวกรองติวเตอร์" className={shellClassName}>
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter
            className="size-4 text-[color:var(--color-primary)]"
            aria-hidden
          />
          <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
            ตัวกรอง
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={reset}
            className="gap-1 text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
          >
            <Eraser className="size-3" />
            ล้างทั้งหมด
          </Button>
        )}
      </header>

      <Separator />

      {/* Price -----------------------------------------------------------*/}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-[color:var(--color-heading)]">
            ช่วงราคา (บาท/ชม.)
          </Label>
          <span className="text-xs font-medium text-[color:var(--color-primary)]">
            {priceDisplay}
          </span>
        </div>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={[priceValue]}
          onValueChange={(v) => {
            // Live label updates feel more responsive — we write URL on commit.
            const next = v[0] ?? PRICE_MAX;
            // Use a fast visual hint via DOM — but we rely on commit for URL.
            // (React re-renders on searchParams change, so intermediate values
            // aren't reflected until commit — acceptable for UX here.)
            void next;
          }}
          onValueCommit={(v) => {
            const next = v[0] ?? PRICE_MAX;
            update("maxPrice", next >= PRICE_MAX ? 0 : next);
          }}
          aria-label="ช่วงราคา"
        />
        <div className="flex justify-between text-[11px] text-[color:var(--color-muted)]">
          <span>฿{PRICE_MIN.toLocaleString("th-TH")}</span>
          <span>฿{PRICE_MAX.toLocaleString("th-TH")}+</span>
        </div>
      </section>

      <Separator />

      {/* Experience -----------------------------------------------------*/}
      <section className="space-y-3">
        <Label className="text-sm font-medium text-[color:var(--color-heading)]">
          ประสบการณ์สอน (ปี)
        </Label>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          className="grid w-full grid-cols-4 gap-2"
          value={
            filters.minExperience === 0 ? "" : String(filters.minExperience)
          }
          onValueChange={(v) => {
            const next = v === "" ? 0 : Number(v);
            update("minExperience", Number.isFinite(next) ? next : 0);
          }}
        >
          {[1, 3, 5, 10].map((year) => (
            <ToggleGroupItem
              key={year}
              value={String(year)}
              aria-label={`ประสบการณ์ ${year} ปีขึ้นไป`}
              className="data-[state=on]:border-[color:var(--color-primary)] data-[state=on]:bg-[color:var(--color-primary)] data-[state=on]:text-white"
            >
              {year}+
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <Separator />

      {/* Province -------------------------------------------------------*/}
      <section className="space-y-3">
        <Label
          htmlFor="filter-province"
          className="text-sm font-medium text-[color:var(--color-heading)]"
        >
          พื้นที่
        </Label>
        <Select
          value={filters.province}
          onValueChange={(v) => update("province", v)}
        >
          <SelectTrigger
            id="filter-province"
            className="w-full"
            aria-label="เลือกจังหวัด"
          >
            <SelectValue placeholder="เลือกจังหวัด" />
          </SelectTrigger>
          <SelectContent>
            {provinceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <Separator />

      {/* Rating ---------------------------------------------------------*/}
      <section className="space-y-3">
        <Label className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-heading)]">
          <Star className="size-3.5 fill-[color:var(--color-cta)] text-[color:var(--color-cta)]" />
          คะแนนรีวิว
        </Label>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          className="grid w-full grid-cols-3 gap-2"
          value={filters.minRating === 0 ? "" : String(filters.minRating)}
          onValueChange={(v) => {
            const next = v === "" ? 0 : Number(v);
            update("minRating", Number.isFinite(next) ? next : 0);
          }}
        >
          {[4, 4.5, 5].map((r) => (
            <ToggleGroupItem
              key={r}
              value={String(r)}
              aria-label={`คะแนน ${r} ขึ้นไป`}
              className="data-[state=on]:border-[color:var(--color-primary)] data-[state=on]:bg-[color:var(--color-primary)] data-[state=on]:text-white"
            >
              {r === 5 ? "5.0" : `${r}+`}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <Separator />

      {/* Gender ---------------------------------------------------------*/}
      <section className="space-y-3">
        <Label className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-heading)]">
          <User2 className="size-3.5 text-[color:var(--color-primary)]" />
          เพศติวเตอร์
        </Label>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          className="grid w-full grid-cols-3 gap-2"
          value={filters.gender === "all" ? "" : filters.gender}
          onValueChange={(v) => update("gender", v === "" ? "all" : v)}
        >
          {["ชาย", "หญิง"].map((g) => (
            <ToggleGroupItem
              key={g}
              value={g}
              className="data-[state=on]:border-[color:var(--color-primary)] data-[state=on]:bg-[color:var(--color-primary)] data-[state=on]:text-white"
            >
              {g}
            </ToggleGroupItem>
          ))}
          <ToggleGroupItem
            value="ไม่ระบุ"
            aria-label="ไม่ระบุเพศ"
            className="data-[state=on]:border-[color:var(--color-primary)] data-[state=on]:bg-[color:var(--color-primary)] data-[state=on]:text-white"
          >
            ไม่ระบุ
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      <Separator />

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={reset}
        disabled={activeCount === 0}
      >
        <Eraser className="size-4" />
        ล้างตัวกรอง
      </Button>
    </aside>
  );
}

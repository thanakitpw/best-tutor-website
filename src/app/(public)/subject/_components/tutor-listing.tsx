"use client";

import { useCallback, useMemo } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ArrowUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/public/empty-state";
import {
  FilterSidebar,
  DEFAULT_FILTERS,
  countActiveFilters,
  parseFiltersFromParams,
  serializeFiltersToParams,
  type ProvinceOption,
  type TutorFilterState,
} from "@/components/public/filter-sidebar";
import { FilterMobileSheet } from "@/components/public/filter-mobile-sheet";
import { Pagination } from "@/components/public/pagination";
import { TutorCard } from "@/components/public/tutor-card";
import type { ListingTutor } from "../_data";

const SORT_OPTIONS = [
  { value: "popular", label: "ความนิยม" },
  { value: "rating", label: "คะแนนสูง → ต่ำ" },
  { value: "price_asc", label: "ราคาต่ำ → สูง" },
  { value: "newest", label: "ใหม่ล่าสุด" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: SortKey = "popular";
const PAGE_SIZE = 12;

interface TutorListingProps {
  tutors: readonly ListingTutor[];
  provinceOptions: readonly ProvinceOption[];
  /** Used when filter result is empty — we suggest /find-tutor by default. */
  emptyCta?: {
    href: string;
    label: string;
  };
}

/**
 * Client-side grid that reads URL params → filters/sorts/paginates tutors.
 *
 * Scope note: works on mock data passed from the RSC parent. When the
 * Backend /api/tutors endpoint is ready we'll keep this component but feed
 * it via TanStack Query so params stay the single source of truth.
 */
export function TutorListing({
  tutors,
  provinceOptions,
  emptyCta = {
    href: "/find-tutor",
    label: "กรอกฟอร์มหาครู",
  },
}: TutorListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );
  const sort: SortKey = useMemo(() => {
    const raw = searchParams.get("sort");
    return (SORT_OPTIONS.find((o) => o.value === raw)?.value ??
      DEFAULT_SORT) as SortKey;
  }, [searchParams]);
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  }, [searchParams]);

  const activeCount = countActiveFilters(filters);

  // --- Derived list -------------------------------------------------------
  const filtered = useMemo(
    () => applyFilters(tutors, filters),
    [tutors, filters],
  );
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageSlice = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  // --- URL mutators -------------------------------------------------------
  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setSort = useCallback(
    (value: SortKey) => {
      pushParams((p) => {
        if (value === DEFAULT_SORT) p.delete("sort");
        else p.set("sort", value);
        // changing sort should restart pagination
        p.delete("page");
      });
    },
    [pushParams],
  );

  const setPage = useCallback(
    (next: number) => {
      pushParams((p) => {
        if (next <= 1) p.delete("page");
        else p.set("page", String(next));
      });
      // Scroll to the top of the grid so the user sees the new page.
      if (typeof window !== "undefined") {
        const el = document.getElementById("tutor-listing-top");
        if (el)
          el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [pushParams],
  );

  const clearSingleFilter = useCallback(
    (key: keyof TutorFilterState) => {
      const next: TutorFilterState = {
        ...filters,
        [key]: DEFAULT_FILTERS[key],
      };
      const params = serializeFiltersToParams(
        next,
        new URLSearchParams(searchParams.toString()),
      );
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router, searchParams],
  );

  const resetAll = useCallback(() => {
    const next = new URLSearchParams();
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar — desktop */}
      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        <FilterSidebar provinceOptions={provinceOptions} />
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div
          id="tutor-listing-top"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FilterMobileSheet
              provinceOptions={provinceOptions}
              activeCount={activeCount}
            />
            <p className="text-sm text-[color:var(--color-body)]">
              พบ{" "}
              <span className="font-semibold text-[color:var(--color-heading)]">
                {sorted.length.toLocaleString("th-TH")}
              </span>{" "}
              ติวเตอร์
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <ArrowUpDown className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">เรียงตาม</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger
                className="h-9 w-40 text-sm"
                aria-label="เรียงลำดับติวเตอร์"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* Active filter chips — desktop only; mobile relies on the sheet badge */}
        {activeCount > 0 && (
          <div className="hidden flex-wrap gap-2 lg:flex">
            {buildChipList(filters).map((chip) => (
              <Badge
                key={chip.key}
                variant="secondary"
                className="gap-1 bg-[color:var(--color-light-bg)] px-2.5 py-1 text-[color:var(--color-primary)]"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => clearSingleFilter(chip.key)}
                  aria-label={`ลบตัวกรอง ${chip.label}`}
                  className="-mr-0.5 rounded-full p-0.5 transition-colors hover:bg-[color:var(--color-primary)]/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
              onClick={resetAll}
            >
              ล้างทั้งหมด
            </Button>
          </div>
        )}

        {/* Grid or empty state */}
        {pageSlice.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageSlice.map((tutor) => (
                <TutorCard
                  key={tutor.slug}
                  tutor={{
                    slug: tutor.slug,
                    nickname: tutor.nickname,
                    firstName: tutor.firstName,
                    lastName: tutor.lastName,
                    profileImageUrl: tutor.profileImageUrl,
                    rating: tutor.rating,
                    reviewCount: tutor.reviewCount,
                    ratePricing: tutor.ratePricing,
                    subjects: tutor.subjects,
                    province: tutor.province,
                    education: tutor.education,
                    isPopular: tutor.isPopular,
                  }}
                />
              ))}
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
              className="pt-4"
            />
          </>
        ) : (
          <EmptyState
            title="ไม่พบติวเตอร์ที่ตรงกับตัวกรอง"
            description="ลองปรับตัวกรอง เช่น ลดเงื่อนไขประสบการณ์หรือช่วงราคา หรือให้ทีมงานช่วยจับคู่ติวเตอร์ให้"
            action={emptyCta}
            secondaryAction={
              activeCount > 0
                ? { label: "ล้างตัวกรอง", onClick: resetAll }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

// ---- Pure helpers ---------------------------------------------------------

function applyFilters(
  tutors: readonly ListingTutor[],
  f: TutorFilterState,
): readonly ListingTutor[] {
  return tutors.filter((t) => {
    if (f.maxPrice > 0 && t.ratePricing > f.maxPrice) return false;
    if (f.minExperience > 0 && t.experienceYears < f.minExperience) return false;
    if (f.province !== "all") {
      // Province strings in mock data are free-text (e.g. "กรุงเทพมหานคร",
      // "ออนไลน์"). A contains-check keeps us flexible once Backend sends
      // more detailed address strings.
      const prov = t.province ?? "";
      if (!prov.includes(f.province)) return false;
    }
    if (f.minRating > 0 && t.rating < f.minRating) return false;
    if (f.gender !== "all") {
      // "ไม่ระบุ" is a UI option — no seeded tutor carries it, so the filter
      // surfaces zero rows honestly until Backend returns that gender.
      if (t.gender !== f.gender) return false;
    }
    return true;
  });
}

function applySort(
  tutors: readonly ListingTutor[],
  sort: SortKey,
): readonly ListingTutor[] {
  // Clone to avoid mutating the memoized filtered array.
  const arr = [...tutors];
  switch (sort) {
    case "rating":
      arr.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
      break;
    case "price_asc":
      arr.sort((a, b) => a.ratePricing - b.ratePricing);
      break;
    case "newest":
      // Mock has no createdAt — fall back to slug-based hash for determinism.
      arr.sort((a, b) => (a.slug < b.slug ? 1 : -1));
      break;
    case "popular":
    default:
      arr.sort((a, b) => {
        if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;
        if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
        return b.rating - a.rating;
      });
      break;
  }
  return arr;
}

interface Chip {
  key: keyof TutorFilterState;
  label: string;
}

function buildChipList(f: TutorFilterState): Chip[] {
  const chips: Chip[] = [];
  if (f.maxPrice !== DEFAULT_FILTERS.maxPrice) {
    chips.push({
      key: "maxPrice",
      label: `ไม่เกิน ฿${f.maxPrice.toLocaleString("th-TH")}/ชม.`,
    });
  }
  if (f.minExperience !== DEFAULT_FILTERS.minExperience) {
    chips.push({
      key: "minExperience",
      label: `ประสบการณ์ ${f.minExperience}+ ปี`,
    });
  }
  if (f.province !== DEFAULT_FILTERS.province) {
    chips.push({ key: "province", label: f.province });
  }
  if (f.minRating !== DEFAULT_FILTERS.minRating) {
    chips.push({
      key: "minRating",
      label: `คะแนน ${f.minRating === 5 ? "5.0" : `${f.minRating}+`}`,
    });
  }
  if (f.gender !== DEFAULT_FILTERS.gender) {
    chips.push({ key: "gender", label: `เพศ: ${f.gender}` });
  }
  return chips;
}

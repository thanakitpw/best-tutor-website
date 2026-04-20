"use client";

import { useCallback, useState } from "react";
import { RotateCcw, Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Human-readable rating copy used under the stars so the user
 * knows what each level *means* before committing. Helps
 * calibrate expectations (esp. for 3-star = "okay", not "bad").
 */
const RATING_LABELS: Record<number, string> = {
  1: "แย่มาก",
  2: "แย่",
  3: "พอใช้",
  4: "ดีมาก",
  5: "ยอดเยี่ยม",
};

export interface ReviewStarInputProps {
  /** Current rating 0-5 (0 = not selected yet). */
  value: number;
  /** Fired when the user picks a rating via click or keyboard. */
  onChange: (next: number) => void;
  /** Visual size of the stars. */
  size?: "sm" | "md" | "lg";
  /** Optional aria-label for the whole group. */
  ariaLabel?: string;
  /** Whether the field is in an error state (controls focus ring colour). */
  invalid?: boolean;
  /** Optional id — used to associate aria-describedby from parent form. */
  id?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
} as const;

/**
 * Shopee-style star rating picker with full keyboard a11y.
 *
 * Behaviour:
 *   - Click any star to set rating
 *   - Hover previews rating by painting stars up to hovered index
 *   - ArrowLeft / ArrowRight decrement / increment rating
 *   - Home sets rating to 1, End sets rating to 5
 *   - Reset button clears rating when value > 0
 *
 * A11y:
 *   - role="radiogroup" on the star row
 *   - each star is role="radio" with aria-checked + aria-label (ภาษาไทย)
 *   - aria-live region announces the current rating label
 */
export function ReviewStarInput({
  value,
  onChange,
  size = "lg",
  ariaLabel = "ให้คะแนนติวเตอร์",
  invalid = false,
  id,
  className,
}: ReviewStarInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;
  const sizeClass = SIZE_MAP[size];

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
        ev.preventDefault();
        onChange(Math.max(1, (value || 1) - 1));
      } else if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
        ev.preventDefault();
        onChange(Math.min(5, (value || 0) + 1));
      } else if (ev.key === "Home") {
        ev.preventDefault();
        onChange(1);
      } else if (ev.key === "End") {
        ev.preventDefault();
        onChange(5);
      }
    },
    [onChange, value],
  );

  const handleReset = useCallback(() => {
    onChange(0);
    setHovered(null);
  }, [onChange]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        id={id}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHovered(null)}
        className="inline-flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const active = displayValue >= star;
          const selected = value === star;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`ให้ ${star} ดาว — ${RATING_LABELS[star]}`}
              // Only one star is tab-stop at a time per ARIA radio group pattern:
              // the currently-selected star, or the first star if none selected.
              tabIndex={selected || (value === 0 && star === 1) ? 0 : -1}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onBlur={() => setHovered(null)}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition-transform",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
                "hover:scale-110 active:scale-95",
                invalid && "focus-visible:ring-[color:var(--color-error)]",
              )}
            >
              <Star
                className={cn(
                  sizeClass,
                  "transition-colors",
                  active
                    ? "fill-[#FFB900] text-[#FFB900]"
                    : "fill-transparent text-[color:var(--color-border)]",
                )}
                aria-hidden
              />
            </button>
          );
        })}

        {value > 0 && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="ล้างคะแนน"
            className={cn(
              "ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
              "text-[color:var(--color-muted)] transition-colors",
              "hover:bg-[color:var(--color-light-bg)] hover:text-[color:var(--color-primary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
            )}
          >
            <RotateCcw className="size-3" />
            ล้าง
          </button>
        )}
      </div>

      {/* Live region + helper label — screen readers announce rating changes */}
      <p
        aria-live="polite"
        className={cn(
          "min-h-[1.25rem] text-sm",
          displayValue > 0
            ? "font-medium text-[color:var(--color-heading)]"
            : "text-[color:var(--color-muted)]",
        )}
      >
        {displayValue > 0
          ? `ให้ ${displayValue} ดาว — ${RATING_LABELS[displayValue]}`
          : "คลิกเพื่อให้คะแนน"}
      </p>
    </div>
  );
}

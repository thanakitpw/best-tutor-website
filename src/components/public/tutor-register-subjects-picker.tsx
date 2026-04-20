"use client";

/**
 * TutorRegisterSubjectsPicker — multi-select chips + free-text "other subjects"
 * input used on Step 2 of the tutor registration form.
 *
 * Why not a plain Select? The API accepts `subjectsTaught` as a single
 * comma-separated string (summary, admin approves relational mapping in
 * Phase 4). Chips are faster to scan on mobile + allow custom subjects
 * that aren't in the category list (e.g. "TOEIC", "IELTS", "CUTEP").
 *
 * We keep the 9 category labels as quick-pick chips. Custom subjects are
 * added via the "+ เพิ่มวิชาอื่น" text box and rendered as removable chips.
 *
 * The value is a single string: selected categories + custom subjects joined
 * by " , " — matches CreateTutorApplicationInput.subjectsTaught exactly.
 */

import { useCallback, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import { FIND_TUTOR_CATEGORIES } from "@/components/public/find-tutor-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TutorRegisterSubjectsPickerProps {
  /** Current comma-separated value (e.g. "ภาษาอังกฤษ, IELTS"). */
  value: string;
  onChange: (next: string) => void;
  /** aria-invalid passthrough for react-hook-form integration. */
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

const CATEGORY_QUICKPICKS = FIND_TUTOR_CATEGORIES.map((cat) => cat.label);

/** Accepts ", " or "," separators; strips empty + trims each item. */
function parseValue(value: string): string[] {
  if (!value) return [];
  return Array.from(
    new Set(
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

function serialize(list: string[]): string {
  return list.join(", ");
}

export function TutorRegisterSubjectsPicker({
  value,
  onChange,
  ariaInvalid,
  ariaDescribedBy,
}: TutorRegisterSubjectsPickerProps) {
  const selected = useMemo(() => parseValue(value), [value]);
  const [custom, setCustom] = useState("");

  const toggle = useCallback(
    (subject: string) => {
      if (selected.includes(subject)) {
        onChange(serialize(selected.filter((s) => s !== subject)));
      } else {
        onChange(serialize([...selected, subject]));
      }
    },
    [selected, onChange],
  );

  const addCustom = useCallback(() => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    if (selected.includes(trimmed)) {
      setCustom("");
      return;
    }
    onChange(serialize([...selected, trimmed]));
    setCustom("");
  }, [custom, selected, onChange]);

  const remove = useCallback(
    (subject: string) => {
      onChange(serialize(selected.filter((s) => s !== subject)));
    },
    [selected, onChange],
  );

  // Custom subjects are ones that aren't in CATEGORY_QUICKPICKS
  const customSelected = selected.filter(
    (s) => !CATEGORY_QUICKPICKS.includes(s),
  );

  return (
    <div
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
    >
      {/* Quick-pick category chips */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="เลือกหมวดวิชาหลักที่สอน"
      >
        {CATEGORY_QUICKPICKS.map((label) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(label)}
              className={[
                "inline-flex min-h-[40px] items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
                isSelected
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : "border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]/40",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Custom subjects input */}
      <div className="mt-4">
        <p className="text-xs font-medium text-[color:var(--color-muted)]">
          เพิ่มวิชาอื่น (เช่น IELTS, TOEIC, SAT, เตรียมสอบแพทย์)
        </p>
        <div className="mt-2 flex items-stretch gap-2">
          <Input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="พิมพ์ชื่อวิชาแล้วกด Enter หรือคลิกเพิ่ม"
            maxLength={80}
            className="h-11"
            aria-label="เพิ่มวิชาอื่น"
          />
          <Button
            type="button"
            onClick={addCustom}
            variant="outline"
            className="h-11 shrink-0 border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-light-bg)]"
          >
            <Plus className="size-4" />
            เพิ่ม
          </Button>
        </div>
      </div>

      {/* Selected custom chips */}
      {customSelected.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="วิชาที่เพิ่มเอง">
          {customSelected.map((subject) => (
            <li key={subject}>
              <button
                type="button"
                onClick={() => remove(subject)}
                className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-primary)]/30 bg-[color:var(--color-light-bg)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
                aria-label={`ลบ ${subject}`}
              >
                {subject}
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Summary line */}
      {selected.length > 0 && (
        <p className="mt-3 text-xs text-[color:var(--color-muted)]">
          เลือกแล้ว {selected.length} วิชา
        </p>
      )}
    </div>
  );
}

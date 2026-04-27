"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronDown, Loader2, Search, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReviewStarInput } from "@/components/public/review-star-input";
import { ReviewImageUpload } from "@/components/public/review-image-upload";
import { type PublicTutor } from "@/lib/tutors/types";
import { cn } from "@/lib/utils";

// ---- Schema ----------------------------------------------------------------
//
// Mirrors `createReviewSchema` in src/app/api/reviews/route.ts. We always send
// `tutorSlug` (never `tutorId`) because this form lives on the public site.
//
const reviewFormSchema = z.object({
  tutorSlug: z.string().trim().min(1, "กรุณาเลือกติวเตอร์"),
  reviewerName: z
    .string()
    .trim()
    .min(2, "กรุณากรอกชื่อผู้รีวิว (อย่างน้อย 2 ตัวอักษร)")
    .max(100, "ชื่อยาวเกินไป"),
  rating: z
    .number({ error: "กรุณาให้คะแนนก่อน" })
    .int()
    .min(1, "กรุณาให้คะแนนก่อน")
    .max(5),
  comment: z
    .string()
    .trim()
    .max(1000, "รีวิวยาวเกินไป (สูงสุด 1000 ตัวอักษร)")
    .optional()
    .or(z.literal("")),
  images: z.array(z.string().url()).max(5),
  consent: z.literal(true, { message: "กรุณายอมรับนโยบายรีวิวเพื่อส่งต่อ" }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export interface ReviewFormProps {
  /** List of tutors to choose from — injected by the server page so the
   * combobox is hydrated immediately (no loading flash). */
  tutors: readonly PublicTutor[];
  /** Optional pre-selected tutor slug (from `?tutor=<slug>` query param). */
  prefillTutorSlug?: string;
}

/**
 * Submit-review form used on `/review`.
 *
 * Conversion notes (§11 of docs/ux-ui-analysis.md):
 *   - No account required — lowest possible friction
 *   - Tutor combobox is searchable so 100+ tutors stay scannable
 *   - Character count on the comment field primes users to write more
 *   - Gold CTA matches site-wide conversion buttons
 *   - Consent is explicit + concise; we hold reviews for admin moderation
 */
export function ReviewForm({ tutors, prefillTutorSlug }: ReviewFormProps) {
  const router = useRouter();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    mode: "onTouched",
    defaultValues: {
      tutorSlug: prefillTutorSlug && matchTutor(tutors, prefillTutorSlug) ? prefillTutorSlug : "",
      reviewerName: "",
      rating: 0,
      comment: "",
      images: [],
      consent: false as unknown as true,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  // React Hook Form's watch() is a subscription — React Compiler can't memoize
  // it. That's fine here: we only read for derived render values.
  /* eslint-disable react-hooks/incompatible-library */
  const commentLength = form.watch("comment")?.length ?? 0;
  const currentSlug = form.watch("tutorSlug");
  /* eslint-enable react-hooks/incompatible-library */
  const selectedTutor = useMemo(
    () => matchTutor(tutors, currentSlug),
    [tutors, currentSlug],
  );

  const onSubmit: SubmitHandler<ReviewFormValues> = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        tutorSlug: values.tutorSlug,
        reviewerName: values.reviewerName.trim(),
        rating: values.rating,
        ...(values.comment?.trim() ? { comment: values.comment.trim() } : {}),
        images: values.images,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 404 — tutor not found / not approved
      if (res.status === 404) {
        toast.error("ไม่พบติวเตอร์ กรุณาเลือกใหม่");
        form.setError("tutorSlug", {
          message: "ไม่พบติวเตอร์ที่เลือก",
        });
        return;
      }

      let body:
        | { ok: true; data: { id: string } }
        | {
            ok: false;
            error: string;
            issues?: Array<{ path: string; message: string }>;
          }
        | null = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      // 400 validation — mirror field errors back into the form
      if (res.status === 400) {
        const msg =
          body && "error" in body && body.error
            ? body.error
            : "ข้อมูลไม่ครบ กรุณาตรวจสอบ";
        toast.error(msg);
        if (body && "issues" in body && body.issues) {
          for (const issue of body.issues) {
            const path = issue.path as keyof ReviewFormValues;
            if (
              path === "tutorSlug" ||
              path === "reviewerName" ||
              path === "rating" ||
              path === "comment" ||
              path === "images"
            ) {
              form.setError(path, { message: issue.message });
            }
          }
        }
        return;
      }

      if (res.ok && body?.ok) {
        // Preserve tutor slug in the success URL so CTA can link back
        const params = new URLSearchParams();
        if (values.tutorSlug) params.set("tutor", values.tutorSlug);
        router.push(
          `/review/success${params.size ? `?${params.toString()}` : ""}`,
        );
        return;
      }

      // 5xx / unknown — keep form state intact
      toast.error("ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
    } catch (err) {
      console.error("[ReviewForm] submit failed:", err);
      toast.error("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-labelledby="review-form-heading"
    >
      <h2 id="review-form-heading" className="sr-only">
        แบบฟอร์มเขียนรีวิว
      </h2>

      {/* 1. Tutor combobox */}
      <FormRow>
        <Label className="text-sm font-semibold">
          เลือกติวเตอร์ <span className="text-[color:var(--color-error)]">*</span>
        </Label>
        <Controller
          control={form.control}
          name="tutorSlug"
          render={({ field }) => (
            <TutorCombobox
              tutors={tutors}
              value={field.value}
              onChange={(slug) => {
                field.onChange(slug);
                form.clearErrors("tutorSlug");
              }}
              invalid={!!errors.tutorSlug}
            />
          )}
        />
        {selectedTutor && (
          <p className="text-xs text-[color:var(--color-muted)]">
            กำลังรีวิว:{" "}
            <span className="font-medium text-[color:var(--color-body)]">
              {selectedTutor.nickname} ({selectedTutor.subjects.join(" · ")})
            </span>
          </p>
        )}
        <FieldError message={errors.tutorSlug?.message} />
      </FormRow>

      {/* 2. Reviewer name */}
      <FormRow>
        <Label htmlFor="reviewerName" className="text-sm font-semibold">
          ชื่อผู้รีวิว <span className="text-[color:var(--color-error)]">*</span>
        </Label>
        <Input
          id="reviewerName"
          type="text"
          autoComplete="name"
          placeholder="เช่น น้องฟิวส์, คุณแม่สมศรี"
          className="h-11"
          maxLength={100}
          aria-invalid={!!errors.reviewerName}
          {...form.register("reviewerName")}
        />
        <p className="text-xs text-[color:var(--color-muted)]">
          ชื่อจริงหรือชื่อเล่น ไม่จำเป็นต้องใส่นามสกุล
        </p>
        <FieldError message={errors.reviewerName?.message} />
      </FormRow>

      {/* 3. Star rating */}
      <FormRow>
        <Label
          htmlFor="review-rating-group"
          className="text-sm font-semibold"
        >
          ให้คะแนน <span className="text-[color:var(--color-error)]">*</span>
        </Label>
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <ReviewStarInput
              id="review-rating-group"
              value={field.value}
              onChange={(v) => {
                field.onChange(v);
                if (v > 0) form.clearErrors("rating");
              }}
              invalid={!!errors.rating}
            />
          )}
        />
        <FieldError message={errors.rating?.message} />
      </FormRow>

      {/* 4. Comment */}
      <FormRow>
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="comment" className="text-sm font-semibold">
            เขียนรีวิว{" "}
            <span className="text-xs font-normal text-[color:var(--color-muted)]">
              (ไม่บังคับ)
            </span>
          </Label>
          <span
            className={cn(
              "text-xs tabular-nums",
              commentLength > 900
                ? "text-[color:var(--color-error)]"
                : "text-[color:var(--color-muted)]",
            )}
          >
            {commentLength}/1000
          </span>
        </div>
        <Textarea
          id="comment"
          rows={5}
          maxLength={1000}
          placeholder="แชร์ประสบการณ์เรียน — เทคนิคการสอน ผลลัพธ์ สิ่งที่ชอบ ฯลฯ"
          className="min-h-[120px]"
          aria-invalid={!!errors.comment}
          {...form.register("comment")}
        />
        <FieldError message={errors.comment?.message} />
      </FormRow>

      {/* 5. Image upload */}
      <FormRow>
        <Label className="text-sm font-semibold">
          อัปโหลดรูป{" "}
          <span className="text-xs font-normal text-[color:var(--color-muted)]">
            (ไม่บังคับ)
          </span>
        </Label>
        <p className="text-xs text-[color:var(--color-muted)]">
          รูปเรียน / ผลสอบ / การบ้าน — ช่วยเพิ่มความน่าเชื่อถือของรีวิว
        </p>
        <Controller
          control={form.control}
          name="images"
          render={({ field }) => (
            <ReviewImageUpload
              value={field.value}
              onChange={field.onChange}
              maxCount={5}
              disabled={submitting}
            />
          )}
        />
      </FormRow>

      {/* 6. Consent */}
      <FormRow>
        <div className="flex items-start gap-3 rounded-lg bg-[color:var(--color-alt-bg)] p-3">
          <Controller
            control={form.control}
            name="consent"
            render={({ field, fieldState }) => (
              <>
                <input
                  id="consent"
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-1 size-4 cursor-pointer rounded border-[color:var(--color-border)] accent-[color:var(--color-primary)]"
                  aria-invalid={!!fieldState.error}
                />
                <label
                  htmlFor="consent"
                  className="cursor-pointer text-xs leading-5 text-[color:var(--color-body)]"
                >
                  ยอมรับนโยบายรีวิว — รีวิวจะถูกตรวจสอบก่อนเผยแพร่ภายใน 24 ชม.
                  และเราสงวนสิทธิ์ไม่เผยแพร่รีวิวที่มีเนื้อหาไม่เหมาะสม
                </label>
              </>
            )}
          />
        </div>
        <FieldError message={errors.consent?.message} />
      </FormRow>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className={cn(
          "h-12 w-full bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)]",
          "hover:bg-[color:var(--color-cta-hover)] disabled:opacity-70 md:w-auto md:min-w-[240px]",
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            กำลังส่งรีวิว...
          </>
        ) : (
          <>
            <Send className="size-5" />
            ส่งรีวิว
          </>
        )}
      </Button>
    </form>
  );
}

// ---- Small helpers ---------------------------------------------------------

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function FieldError({ message }: { message?: string }) {
  return (
    <p
      aria-live="polite"
      className="min-h-[1em] text-xs text-[color:var(--color-error)]"
    >
      {message ?? ""}
    </p>
  );
}

function matchTutor(
  tutors: readonly PublicTutor[],
  slug: string | undefined,
): PublicTutor | undefined {
  if (!slug) return undefined;
  return tutors.find((t) => t.slug === slug);
}

// ---- Tutor combobox --------------------------------------------------------
//
// We use a <Popover> + hand-rolled searchable list since the shadcn Command
// primitive isn't installed. This also gives us room for custom rows
// (avatar + name + subjects) that a plain <Select> can't show cleanly.
//
interface TutorComboboxProps {
  tutors: readonly PublicTutor[];
  value: string;
  onChange: (slug: string) => void;
  invalid?: boolean;
}

function TutorCombobox({
  tutors,
  value,
  onChange,
  invalid,
}: TutorComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listboxId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tutors;
    return tutors.filter((t) => {
      const hay = [
        t.nickname,
        t.firstName,
        t.lastName,
        t.slug,
        ...t.subjects,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, tutors]);

  const selected = matchTutor(tutors, value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
            invalid
              ? "border-[color:var(--color-error)]"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50",
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate text-left text-[color:var(--color-heading)]">
              <TutorInitialsAvatar tutor={selected} />
              <span className="truncate font-medium">
                {selected.nickname}
                <span className="ml-1 font-normal text-[color:var(--color-muted)]">
                  · {selected.subjects.slice(0, 2).join(", ")}
                </span>
              </span>
            </span>
          ) : (
            <span className="text-[color:var(--color-muted)]">
              เลือกติวเตอร์ที่คุณเรียน
            </span>
          )}
          <ChevronDown
            className="size-4 shrink-0 text-[color:var(--color-muted)]"
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] px-3 py-2">
          <Search
            className="size-4 text-[color:var(--color-muted)]"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อติวเตอร์ หรือวิชา"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--color-muted)]"
            aria-label="ค้นหาติวเตอร์"
          />
        </div>
        <ul
          id={listboxId}
          role="listbox"
          aria-label="รายชื่อติวเตอร์"
          className="max-h-64 overflow-y-auto p-1"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-[color:var(--color-muted)]">
              ไม่พบติวเตอร์ที่ตรงกับ &quot;{query}&quot;
            </li>
          )}
          {filtered.map((tutor) => {
            const isSelected = tutor.slug === value;
            return (
              <li key={tutor.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(tutor.slug);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:bg-[color:var(--color-light-bg)]",
                    isSelected
                      ? "bg-[color:var(--color-light-bg)]"
                      : "hover:bg-[color:var(--color-light-bg)]/60",
                  )}
                >
                  <TutorInitialsAvatar tutor={tutor} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[color:var(--color-heading)]">
                      {tutor.nickname} {tutor.firstName}
                    </span>
                    <span className="block truncate text-xs text-[color:var(--color-muted)]">
                      {tutor.subjects.join(" · ")}
                    </span>
                  </span>
                  {isSelected && (
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[color:var(--color-primary)]"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function TutorInitialsAvatar({ tutor }: { tutor: PublicTutor }) {
  const initials = (
    tutor.nickname.replace(/^ครู/, "").trim() || tutor.firstName
  ).slice(0, 2);
  return (
    <span
      aria-hidden
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-xs font-semibold text-white"
    >
      {initials}
    </span>
  );
}

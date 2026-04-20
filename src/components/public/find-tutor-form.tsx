"use client";

/**
 * FindTutorForm — 2-step "Value Before Ask" lead-capture flow.
 *
 * Phase 3.6 / the single most important conversion component on the site.
 * Flow:
 *   Step 1: category + optional subject/age/province/goal → submit (no PII)
 *   Step 1.5 ("preview"): show up to 5 mock-filtered tutors. Demonstrates
 *           value *before* we ask for contact info. Zero blocking on user.
 *   Step 2: fullName + phone (+ optional email/line + consent) → POST /api/leads
 *   Success: redirect to `/find-tutor/success?id=...`
 *
 * CRO decisions intentionally diverging from a classic 1-page form:
 *   - Split requested by ux-ui-analysis.md §2 + §6
 *   - `sessionStorage` draft auto-restore, so a mid-flow refresh keeps
 *     user data + step. Cleared on successful submit or manual reset.
 *   - beforeunload warning only if user has typed PII in step 2 (prevents
 *     false alarms when a visitor just clicks away in step 1).
 *   - 5xx fallback surfaces a LINE contact escape hatch so leads aren't lost.
 *   - Rate-limit (429) shown as an empathetic message instead of bare error.
 *
 * Analytics placeholders (TODO markers) will be wired in Phase 6.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { TutorCard } from "@/components/public/tutor-card";
import { MOCK_FEATURED_TUTORS, CONTACT_INFO } from "@/components/public/mock-data";
import {
  FIND_TUTOR_AGE_GROUPS,
  FIND_TUTOR_CATEGORIES,
  THAI_PROVINCES,
  getCategoryBySlug,
  type FindTutorCategory,
} from "@/components/public/find-tutor-options";

// ---- Schemas ---------------------------------------------------------------

const PHONE_REGEX = /^[0-9+\-() ]{9,20}$/;

const step1Schema = z.object({
  categorySlug: z.string().min(1, "กรุณาเลือกหมวดวิชา"),
  subjectSlug: z.string().optional(),
  ageGroup: z.string().optional(),
  province: z.string().optional(),
  district: z
    .string()
    .trim()
    .max(120, "ชื่อเขต/อำเภอยาวเกินไป")
    .optional(),
  learningGoal: z
    .string()
    .trim()
    .max(500, "เล่าเป้าหมายได้ไม่เกิน 500 ตัวอักษร")
    .optional(),
});
type Step1Values = z.infer<typeof step1Schema>;

const step2Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "กรุณากรอกชื่อ-นามสกุล")
    .max(100, "ชื่อ-นามสกุลยาวเกินไป"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  email: z
    .string()
    .trim()
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .max(200)
    .optional()
    .or(z.literal("")),
  lineId: z.string().trim().max(100).optional().or(z.literal("")),
  consent: z.literal(true, {
    message: "กรุณายอมรับข้อกำหนดเพื่อดำเนินการต่อ",
  }),
});
type Step2Values = z.infer<typeof step2Schema>;

// ---- Draft auto-save --------------------------------------------------------

const DRAFT_KEY = "besttutor.find-tutor.draft.v1";

type DraftShape = {
  step: Step;
  step1: Step1Values;
  step2: Pick<Step2Values, "fullName" | "phone" | "email" | "lineId">;
};

function safeReadDraft(): Partial<DraftShape> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftShape>;
    return parsed;
  } catch {
    return null;
  }
}

function safeWriteDraft(value: Partial<DraftShape>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch {
    // quota or privacy mode — swallow; draft persistence is best-effort
  }
}

function safeClearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

// ---- Step machine ----------------------------------------------------------

type Step = "step1" | "preview" | "step2";

// ---- Component -------------------------------------------------------------

export interface FindTutorFormProps {
  /** Initial values (from `searchParams` passed by the server page). */
  initialValues?: Partial<Step1Values>;
}

export function FindTutorForm({ initialValues }: FindTutorFormProps) {
  const router = useRouter();

  // Mount gate so sessionStorage access never runs during SSR hydration
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("step1");

  // --- Step 1 form ---------------------------------------------------------
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
    defaultValues: {
      categorySlug: initialValues?.categorySlug ?? "",
      subjectSlug: initialValues?.subjectSlug ?? "",
      ageGroup: initialValues?.ageGroup ?? "",
      province: initialValues?.province ?? "",
      district: initialValues?.district ?? "",
      learningGoal: initialValues?.learningGoal ?? "",
    },
  });
  const step1Values = step1Form.watch();
  const selectedCategory: FindTutorCategory | undefined = useMemo(
    () => getCategoryBySlug(step1Values.categorySlug),
    [step1Values.categorySlug],
  );

  // --- Step 2 form ---------------------------------------------------------
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      lineId: "",
      consent: false as unknown as true,
    },
  });

  // --- Hydrate from sessionStorage (post-mount) ----------------------------
  useEffect(() => {
    setMounted(true);
    const draft = safeReadDraft();
    if (!draft) return;

    if (draft.step1) {
      // Only overwrite if current values are empty-ish — this preserves query
      // params that arrived from HeroSearch (pre-fill wins over stale draft).
      const current = step1Form.getValues();
      const merged: Step1Values = {
        categorySlug: current.categorySlug || draft.step1.categorySlug || "",
        subjectSlug: current.subjectSlug || draft.step1.subjectSlug || "",
        ageGroup: current.ageGroup || draft.step1.ageGroup || "",
        province: current.province || draft.step1.province || "",
        district: current.district || draft.step1.district || "",
        learningGoal:
          current.learningGoal || draft.step1.learningGoal || "",
      };
      step1Form.reset(merged);
    }
    if (draft.step2) {
      step2Form.reset({
        fullName: draft.step2.fullName ?? "",
        phone: draft.step2.phone ?? "",
        email: draft.step2.email ?? "",
        lineId: draft.step2.lineId ?? "",
        consent: false as unknown as true,
      });
    }
    if (draft.step && draft.step !== "step1") {
      // Only advance to a later step if step1 is actually valid
      const isStep1Ok = step1Schema.safeParse(step1Form.getValues()).success;
      if (isStep1Ok) setStep(draft.step);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Persist draft on every change (post-mount) --------------------------
  // watch() returns a subscription — React Compiler can't memoize it, but
  // for sessionStorage persistence that's fine: we only read on mount.
  /* eslint-disable react-hooks/incompatible-library */
  useEffect(() => {
    if (!mounted) return;
    const sub1 = step1Form.watch((values) => {
      const s2 = step2Form.getValues();
      safeWriteDraft({
        step,
        step1: values as Step1Values,
        step2: {
          fullName: s2.fullName,
          phone: s2.phone,
          email: s2.email,
          lineId: s2.lineId,
        },
      });
    });
    const sub2 = step2Form.watch((values) => {
      const s1 = step1Form.getValues();
      safeWriteDraft({
        step,
        step1: s1,
        step2: {
          fullName: values.fullName ?? "",
          phone: values.phone ?? "",
          email: values.email ?? "",
          lineId: values.lineId ?? "",
        },
      });
    });
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [mounted, step, step1Form, step2Form]);
  /* eslint-enable react-hooks/incompatible-library */

  // --- beforeunload guard only when user has PII in step 2 -----------------
  useEffect(() => {
    if (!mounted) return;
    const handler = (ev: BeforeUnloadEvent) => {
      const { fullName, phone } = step2Form.getValues();
      if (step === "step2" && (fullName?.trim() || phone?.trim())) {
        ev.preventDefault();
        ev.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [mounted, step, step2Form]);

  // --- Submit handlers -----------------------------------------------------

  const onStep1Submit: SubmitHandler<Step1Values> = useCallback(
    () => {
      // TODO(phase-6): ga4.event("find_tutor_step1_complete", { category: step1Form.getValues("categorySlug") })
      setStep("preview");
      // smooth-scroll so recommendations are visible on mobile
      requestAnimationFrame(() => {
        document
          .getElementById("find-tutor-preview")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [],
  );

  const goBackToStep1 = useCallback(() => {
    setStep("step1");
    requestAnimationFrame(() => {
      document
        .getElementById("find-tutor-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goToStep2 = useCallback(() => {
    setStep("step2");
    requestAnimationFrame(() => {
      document
        .getElementById("find-tutor-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const onStep2Submit: SubmitHandler<Step2Values> = useCallback(
    async (values) => {
      setSubmitting(true);
      try {
        const s1 = step1Form.getValues();
        const category = getCategoryBySlug(s1.categorySlug);
        const subject =
          category?.subjects?.find((s) => s.slug === s1.subjectSlug)?.label;
        const ageLabel = FIND_TUTOR_AGE_GROUPS.find(
          (g) => g.value === s1.ageGroup,
        )?.label;

        const payload = {
          subjectCategory: category?.label ?? s1.categorySlug,
          ...(subject ? { subject } : {}),
          ...(s1.learningGoal?.trim()
            ? { learningGoal: s1.learningGoal.trim() }
            : {}),
          ...(ageLabel ? { studentAgeGroup: ageLabel } : {}),
          ...(s1.province?.trim() ? { province: s1.province.trim() } : {}),
          ...(s1.district?.trim() ? { district: s1.district.trim() } : {}),
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          ...(values.email?.trim() ? { email: values.email.trim() } : {}),
          ...(values.lineId?.trim() ? { lineId: values.lineId.trim() } : {}),
        };

        // TODO(phase-6): ga4.event("find_tutor_submit", { category: category?.slug, province: payload.province })

        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.status === 429) {
          toast.error("ส่งคำขอถี่เกินไป กรุณาลองใหม่ใน 5 นาที");
          return;
        }

        // Parse response body once so error handling can surface `issues`
        let body:
          | { ok: true; data: { id: string; createdAt: string } }
          | { ok: false; error: string; issues?: Array<{ path: string; message: string }> }
          | null = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }

        if (res.status === 400) {
          const msg = body && "error" in body && body.error
            ? body.error
            : "ข้อมูลไม่ครบ กรุณาตรวจสอบ";
          toast.error(msg);
          // Surface per-field errors when the API returned them
          if (body && "issues" in body && body.issues?.length) {
            for (const issue of body.issues) {
              const path = issue.path;
              if (path === "fullName" || path === "phone" || path === "email" || path === "lineId") {
                step2Form.setError(path, { message: issue.message });
              }
            }
          }
          return;
        }

        if (res.ok && body?.ok) {
          safeClearDraft();
          router.push(`/find-tutor/success?id=${encodeURIComponent(body.data.id)}`);
          return;
        }

        // 5xx / unexpected — keep the user's data, show LINE escape hatch
        toast.error("ระบบมีปัญหา กรุณาลองใหม่ หรือทักผ่าน LINE เพื่อให้ทีมติดต่อกลับ");
      } catch (err) {
        console.error("[FindTutorForm] submit failed:", err);
        toast.error("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setSubmitting(false);
      }
    },
    [router, step1Form, step2Form],
  );

  // Note on keyboard: the default <form> Enter-submits behaviour is what we
  // want here — textarea accepts multi-line as expected, selects intercept
  // Enter themselves, inputs submit the parent form.

  // --- Recommended tutors (mock filter; Phase 8 replaces with real query) --
  const recommendedTutors = useMemo(() => {
    if (!selectedCategory) return MOCK_FEATURED_TUTORS.slice(0, 5);
    const keywords = [
      selectedCategory.label,
      ...(selectedCategory.subjects?.map((s) => s.label) ?? []),
    ];
    // Simple contains-match on any subject tag, fall back to featured order.
    const matches = MOCK_FEATURED_TUTORS.filter((t) =>
      t.subjects.some((s) => keywords.some((k) => s.includes(k) || k.includes(s))),
    );
    const pool = matches.length > 0 ? matches : MOCK_FEATURED_TUTORS;
    return pool.slice(0, 5);
  }, [selectedCategory]);

  // Progress bar value by step
  const progressValue = step === "step1" ? 50 : step === "preview" ? 75 : 100;
  const progressLabel =
    step === "step2" ? "ขั้นตอน 2 จาก 2" : "ขั้นตอน 1 จาก 2";

  return (
    <section
      id="find-tutor-form"
      aria-label="ฟอร์มหาครูสอนพิเศษ"
      className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm md:p-8"
    >
      {/* Progress header — always visible so the user knows where they are */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-wide uppercase text-[color:var(--color-primary)]">
          {progressLabel}
        </p>
        <span className="text-xs text-[color:var(--color-muted)]">
          {progressValue}%
        </span>
      </div>
      <Progress
        value={progressValue}
        className="mb-6 h-2 bg-[color:var(--color-light-bg)]"
      />

      {step === "step1" && (
        <form
          onSubmit={step1Form.handleSubmit(onStep1Submit)}
          noValidate
          aria-labelledby="find-tutor-step1-heading"
        >
          <header className="mb-6">
            <h2
              id="find-tutor-step1-heading"
              className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
            >
              บอกเราว่าคุณสนใจวิชาอะไร
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              เลือกหมวดวิชาก่อน เราจะแนะนำติวเตอร์ที่เหมาะให้ทันที —
              ไม่ต้องกรอกเบอร์โทรในขั้นตอนนี้
            </p>
          </header>

          {/* Category grid — single-select via div buttons (no radio primitive installed) */}
          <fieldset className="mb-6">
            <legend className="mb-3 block text-sm font-semibold text-[color:var(--color-heading)]">
              หมวดวิชา <span className="text-[color:var(--color-error)]">*</span>
            </legend>
            <Controller
              control={step1Form.control}
              name="categorySlug"
              render={({ field, fieldState }) => (
                <>
                  <div
                    role="radiogroup"
                    aria-label="เลือกหมวดวิชา"
                    aria-invalid={!!fieldState.error}
                    aria-describedby="category-error"
                    className="grid grid-cols-2 gap-2 md:grid-cols-3"
                  >
                    {FIND_TUTOR_CATEGORIES.map((cat) => {
                      const selected = field.value === cat.slug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            field.onChange(cat.slug);
                            // clear dependent subject if category changes
                            step1Form.setValue("subjectSlug", "");
                          }}
                          className={[
                            "group flex min-h-[88px] flex-col items-start justify-center gap-1 rounded-xl border p-3 text-left transition-all md:min-h-[96px] md:p-4",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
                            selected
                              ? "border-[color:var(--color-primary)] bg-[color:var(--color-light-bg)] shadow-sm"
                              : "border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-primary)]/40 hover:bg-[color:var(--color-light-bg)]/60",
                          ].join(" ")}
                        >
                          <cat.icon
                            aria-hidden
                            className="h-7 w-7 text-[color:var(--color-primary)] md:h-8 md:w-8"
                          />
                          {/* lucide icon replaces previous emoji visual */}
                          <span
                            className={[
                              "text-sm font-semibold leading-tight",
                              selected
                                ? "text-[color:var(--color-primary)]"
                                : "text-[color:var(--color-heading)]",
                            ].join(" ")}
                          >
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-[color:var(--color-muted)] line-clamp-1">
                            {cat.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p
                    id="category-error"
                    aria-live="polite"
                    className="mt-2 min-h-[1em] text-xs text-[color:var(--color-error)]"
                  >
                    {fieldState.error?.message ?? ""}
                  </p>
                </>
              )}
            />
          </fieldset>

          {/* Dependent subject select */}
          {selectedCategory?.subjects && selectedCategory.subjects.length > 0 && (
            <FormRow>
              <Label htmlFor="subjectSlug" className="text-sm font-semibold">
                วิชาย่อย <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
              </Label>
              <Controller
                control={step1Form.control}
                name="subjectSlug"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}
                  >
                    <SelectTrigger
                      id="subjectSlug"
                      className="h-11 w-full border-[color:var(--color-border)] bg-white"
                    >
                      <SelectValue placeholder="เลือกวิชาย่อย (ถ้ามี)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="__none__">ยังไม่แน่ใจ</SelectItem>
                        {(selectedCategory.subjects ?? []).map((s) => (
                          <SelectItem key={s.slug} value={s.slug}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormRow>
          )}

          {/* Age / grade — toggle-like buttons */}
          <FormRow>
            <Label className="text-sm font-semibold">
              ระดับชั้น / เป้าหมาย{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Controller
              control={step1Form.control}
              name="ageGroup"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2" role="group" aria-label="ระดับชั้น">
                  {FIND_TUTOR_AGE_GROUPS.map((g) => {
                    const selected = field.value === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(selected ? "" : g.value)
                        }
                        className={[
                          "inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
                          selected
                            ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                            : "border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]/40",
                        ].join(" ")}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </FormRow>

          {/* Province */}
          <FormRow>
            <Label htmlFor="province" className="text-sm font-semibold">
              จังหวัด{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Controller
              control={step1Form.control}
              name="province"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}
                >
                  <SelectTrigger
                    id="province"
                    className="h-11 w-full border-[color:var(--color-border)] bg-white"
                  >
                    <SelectValue placeholder="เลือกจังหวัดหรือออนไลน์" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px]">
                    <SelectGroup>
                      <SelectItem value="__none__">ยังไม่ระบุ</SelectItem>
                      {THAI_PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>

          {/* District free text */}
          <FormRow>
            <Label htmlFor="district" className="text-sm font-semibold">
              เขต/อำเภอ{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Input
              id="district"
              type="text"
              placeholder="เช่น ลาดพร้าว, เมือง"
              className="h-11"
              maxLength={120}
              {...step1Form.register("district")}
              aria-invalid={!!step1Form.formState.errors.district}
            />
            {step1Form.formState.errors.district && (
              <p className="text-xs text-[color:var(--color-error)]">
                {step1Form.formState.errors.district.message}
              </p>
            )}
          </FormRow>

          {/* Learning goal */}
          <FormRow>
            <Label htmlFor="learningGoal" className="text-sm font-semibold">
              เป้าหมายการเรียน{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Textarea
              id="learningGoal"
              placeholder="เล่าสั้นๆ — เตรียมสอบอะไร? อยากพัฒนาด้านไหน? เช่น เตรียม TGAT, เพิ่มเกรดวิชาอังกฤษ, พูดคล่อง"
              rows={3}
              maxLength={500}
              {...step1Form.register("learningGoal")}
              aria-invalid={!!step1Form.formState.errors.learningGoal}
              className="min-h-[88px]"
            />
            <p className="text-xs text-[color:var(--color-muted)]">
              {(step1Values.learningGoal?.length ?? 0)}/500 ตัวอักษร
            </p>
          </FormRow>

          <Button
            type="submit"
            size="lg"
            className="mt-2 h-12 w-full bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
          >
            ดูติวเตอร์ที่แนะนำ
            <ArrowRight className="size-5" />
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[color:var(--color-muted)]">
            <ShieldCheck className="size-3.5" /> ฟรี — ยังไม่ต้องกรอกเบอร์โทร
          </p>
        </form>
      )}

      {step === "preview" && (
        <PreviewStep
          categoryLabel={selectedCategory?.label ?? "ทุกวิชา"}
          tutors={recommendedTutors}
          onBack={goBackToStep1}
          onContinue={goToStep2}
        />
      )}

      {step === "step2" && (
        <form
          onSubmit={step2Form.handleSubmit(onStep2Submit)}
          noValidate
          aria-labelledby="find-tutor-step2-heading"
        >
          <header className="mb-6">
            <button
              type="button"
              onClick={() => setStep("preview")}
              className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-primary)] hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              กลับไปดูติวเตอร์ที่แนะนำ
            </button>
            <h2
              id="find-tutor-step2-heading"
              className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
            >
              กรอกข้อมูลติดต่อ
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              ทีมงานจะโทรกลับภายใน 24 ชั่วโมง เพื่อจับคู่ติวเตอร์ที่เหมาะที่สุด
            </p>
          </header>

          <FormRow>
            <Label htmlFor="fullName" className="text-sm font-semibold">
              ชื่อ-นามสกุล <span className="text-[color:var(--color-error)]">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="ชื่อ-นามสกุล หรือผู้ปกครอง"
              className="h-11"
              maxLength={100}
              {...step2Form.register("fullName")}
              aria-invalid={!!step2Form.formState.errors.fullName}
            />
            <FieldError message={step2Form.formState.errors.fullName?.message} />
          </FormRow>

          <FormRow>
            <Label htmlFor="phone" className="text-sm font-semibold">
              เบอร์โทร <span className="text-[color:var(--color-error)]">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="081-234-5678"
              className="h-11 text-base"
              maxLength={20}
              {...step2Form.register("phone")}
              aria-invalid={!!step2Form.formState.errors.phone}
            />
            <FieldError message={step2Form.formState.errors.phone?.message} />
          </FormRow>

          <FormRow>
            <Label htmlFor="email" className="text-sm font-semibold">
              อีเมล{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              className="h-11"
              maxLength={200}
              {...step2Form.register("email")}
              aria-invalid={!!step2Form.formState.errors.email}
            />
            <FieldError message={step2Form.formState.errors.email?.message} />
          </FormRow>

          <FormRow>
            <Label htmlFor="lineId" className="text-sm font-semibold">
              Line ID{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">(ไม่จำเป็น)</span>
            </Label>
            <Input
              id="lineId"
              type="text"
              placeholder="@yourid หรือ yourid"
              className="h-11"
              maxLength={100}
              {...step2Form.register("lineId")}
              aria-invalid={!!step2Form.formState.errors.lineId}
            />
            <FieldError message={step2Form.formState.errors.lineId?.message} />
          </FormRow>

          {/* Consent */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-[color:var(--color-alt-bg)] p-3">
            <Controller
              control={step2Form.control}
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
                    className="text-xs leading-5 text-[color:var(--color-body)] cursor-pointer"
                  >
                    ฉันยอมรับ
                    <Link
                      href="/terms"
                      className="mx-1 font-medium text-[color:var(--color-primary)] underline"
                    >
                      ข้อกำหนดการใช้งาน
                    </Link>
                    และ
                    <Link
                      href="/privacy"
                      className="mx-1 font-medium text-[color:var(--color-primary)] underline"
                    >
                      นโยบายความเป็นส่วนตัว
                    </Link>
                    — ให้ทีมงานติดต่อกลับเพื่อแนะนำติวเตอร์
                  </label>
                </>
              )}
            />
          </div>
          <FieldError message={step2Form.formState.errors.consent?.message} />

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-5 h-12 w-full bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)] disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                กำลังส่งคำขอ...
              </>
            ) : (
              <>
                ส่งคำขอ — ทีมจะติดต่อกลับใน 24 ชม.
                <ArrowRight className="size-5" />
              </>
            )}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[color:var(--color-muted)]">
            <ShieldCheck className="size-3.5 text-[color:var(--color-success)]" />
            ข้อมูลของคุณปลอดภัย 100% — เราจะไม่แชร์ให้บุคคลภายนอก
          </p>

          {/* Escape hatch: if the API is down users should still be able to reach us */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] pt-5 text-center">
            <p className="text-xs text-[color:var(--color-muted)]">
              ติดปัญหา? ทักเราทาง LINE ได้เลย
            </p>
            <a
              href={CONTACT_INFO.lineHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-success)]/40 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10"
            >
              <MessageCircle className="size-4" />
              ทัก LINE @besttutor
            </a>
          </div>
        </form>
      )}
    </section>
  );
}

// ---- Sub-components --------------------------------------------------------

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-2">{children}</div>;
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

interface PreviewStepProps {
  categoryLabel: string;
  tutors: typeof MOCK_FEATURED_TUTORS;
  onBack: () => void;
  onContinue: () => void;
}

function PreviewStep({ categoryLabel, tutors, onBack, onContinue }: PreviewStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      id="find-tutor-preview"
      ref={ref}
      tabIndex={-1}
      aria-labelledby="find-tutor-preview-heading"
      className="outline-none"
    >
      <header className="mb-5">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-light-bg)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)]">
          <Sparkles className="size-3.5" />
          ผลลัพธ์เบื้องต้น
        </div>
        <h2
          id="find-tutor-preview-heading"
          className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
        >
          พบ <span className="text-[color:var(--color-primary)]">{tutors.length} ติวเตอร์</span>{" "}
          ที่เหมาะกับคุณ
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          ตัวอย่างติวเตอร์ในหมวด{" "}
          <span className="font-medium text-[color:var(--color-body)]">
            {categoryLabel}
          </span>{" "}
          — กรอกข้อมูลถัดไปเพื่อให้ทีมจับคู่ติวเตอร์ที่ตรงเป้าหมายที่สุด
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.slug} tutor={tutor} size="compact" />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl bg-[color:var(--color-light-bg)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--color-success)]" />
          <p className="text-sm text-[color:var(--color-body)]">
            ยังไม่ใช่ทั้งหมด — ทีมงานจะหาติวเตอร์เพิ่มเติมให้หลังจากได้รับข้อมูลติดต่อ
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 border-[color:var(--color-border)] text-[color:var(--color-body)]"
        >
          <ArrowLeft className="size-4" />
          แก้ไขข้อมูลวิชา
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          className="h-12 bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)]"
        >
          กรอกข้อมูลติดต่อเพื่อให้ทีมจับคู่
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

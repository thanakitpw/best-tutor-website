"use client";

/**
 * TutorRegisterForm — 3-step application form used by `/tutor-register`.
 *
 * Why 3 steps (vs the old WordPress site's 22 fields on one screen):
 *   - docs/ux-ui-analysis.md §10 flags the old form as a conversion killer;
 *     splitting reduces cognitive load and surfaces a clear progress bar.
 *
 * Flow:
 *   Step 1: identity (name + contact)
 *   Step 2: teaching (education, subjects, rate, address)
 *   Step 3: documents (optional — user can skip and send via LINE later)
 *
 * The form auto-saves to sessionStorage under `besttutor.tutor-register.draft.v1`
 * (excluding uploaded file URLs — users re-upload if they refresh). Submit
 * posts to `/api/tutor-applications` with the shape matching
 * `CreateTutorApplicationInput` from the route file.
 *
 * Validation: per-step Zod schemas + a combined final schema. "Next" button
 * is disabled until the current step is valid. All errors are inline with
 * aria-live regions for screen readers.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Upload,
  User,
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
import { CONTACT_INFO } from "@/components/public/mock-data";
import { TutorRegisterSubjectsPicker } from "@/components/public/tutor-register-subjects-picker";
import {
  TutorRegisterFileUpload,
  type UploadState,
} from "@/components/public/tutor-register-file-upload";

// ---- Schemas ---------------------------------------------------------------

const PHONE_REGEX = /^[0-9+\-() ]{9,20}$/;
const GENDER_VALUES = ["MALE", "FEMALE", "OTHER"] as const;

const step1Schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อ")
    .max(100, "ชื่อยาวเกินไป"),
  lastName: z
    .string()
    .trim()
    .min(1, "กรุณากรอกนามสกุล")
    .max(100, "นามสกุลยาวเกินไป"),
  nickname: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อเล่น")
    .max(50, "ชื่อเล่นยาวเกินไป"),
  gender: z.enum(GENDER_VALUES).optional(),
  email: z
    .string()
    .trim()
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .max(200, "อีเมลยาวเกินไป"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  lineId: z
    .string()
    .trim()
    .min(1, "กรุณากรอก LINE ID")
    .max(100, "LINE ID ยาวเกินไป"),
});
type Step1Values = z.infer<typeof step1Schema>;

const step2Schema = z.object({
  education: z
    .string()
    .trim()
    .min(10, "กรุณาระบุวุฒิการศึกษาอย่างน้อย 10 ตัวอักษร")
    .max(500, "ข้อมูลยาวเกินไป"),
  occupation: z
    .string()
    .trim()
    .max(200, "อาชีพยาวเกินไป")
    .optional()
    .or(z.literal("")),
  teachingExperienceYears: z
    .number({ message: "กรุณาระบุประสบการณ์สอน (ปี)" })
    .int("กรุณาระบุเป็นจำนวนเต็ม")
    .min(0, "ตัวเลขต้องไม่ติดลบ")
    .max(50, "ตัวเลขสูงสุด 50 ปี"),
  teachingStyle: z
    .string()
    .trim()
    .max(1000, "ข้อความยาวเกินไป")
    .optional()
    .or(z.literal("")),
  subjectsTaught: z
    .string()
    .trim()
    .min(1, "กรุณาเลือกหรือระบุวิชาที่สอนอย่างน้อย 1 วิชา")
    .max(500, "วิชามากเกินไป"),
  ratePricing: z
    .string()
    .trim()
    .min(1, "กรุณาระบุอัตราค่าสอน")
    .max(100, "ข้อความยาวเกินไป"),
  address: z
    .string()
    .trim()
    .min(1, "กรุณาระบุที่อยู่")
    .max(500, "ข้อความยาวเกินไป"),
  vehicleType: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),
});
type Step2Values = z.infer<typeof step2Schema>;

// Step 3 is fully optional — captured as UploadState objects in local state,
// not in react-hook-form (files aren't serializable into form state cleanly).

// ---- Draft persistence -----------------------------------------------------

const DRAFT_KEY = "besttutor.tutor-register.draft.v1";

interface DraftShape {
  step: Step;
  step1: Step1Values;
  step2: Step2Values;
}

function safeReadDraft(): Partial<DraftShape> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<DraftShape>;
  } catch {
    return null;
  }
}

function safeWriteDraft(value: Partial<DraftShape>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch {
    /* best-effort */
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

type Step = "step1" | "step2" | "step3";

const STEP_META = {
  step1: {
    label: "ข้อมูลพื้นฐาน",
    progress: 33,
    index: 1,
    icon: User,
  },
  step2: {
    label: "ข้อมูลการสอน",
    progress: 66,
    index: 2,
    icon: BookOpen,
  },
  step3: {
    label: "เอกสาร (ไม่บังคับ)",
    progress: 100,
    index: 3,
    icon: Upload,
  },
} as const;

// ---- Component -------------------------------------------------------------

export function TutorRegisterForm() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("step1");
  const [submitting, setSubmitting] = useState(false);

  // Step 1 form
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      nickname: "",
      gender: undefined,
      email: "",
      phone: "",
      lineId: "",
    },
  });

  // Step 2 form
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
    defaultValues: {
      education: "",
      occupation: "",
      teachingExperienceYears: 0,
      teachingStyle: "",
      subjectsTaught: "",
      ratePricing: "",
      address: "",
      vehicleType: "",
    },
  });

  // Step 3 — file upload states (live in local state, not react-hook-form)
  const [profileImage, setProfileImage] = useState<UploadState>({
    status: "idle",
  });
  const [idCard, setIdCard] = useState<UploadState>({ status: "idle" });
  const [resume, setResume] = useState<UploadState>({ status: "idle" });
  const [credentials, setCredentials] = useState<UploadState[]>([
    { status: "idle" },
  ]);

  // Hydrate from sessionStorage once on mount
  useEffect(() => {
    setMounted(true);
    const draft = safeReadDraft();
    if (!draft) return;

    if (draft.step1) {
      step1Form.reset({
        firstName: draft.step1.firstName ?? "",
        lastName: draft.step1.lastName ?? "",
        nickname: draft.step1.nickname ?? "",
        gender: draft.step1.gender,
        email: draft.step1.email ?? "",
        phone: draft.step1.phone ?? "",
        lineId: draft.step1.lineId ?? "",
      });
    }
    if (draft.step2) {
      step2Form.reset({
        education: draft.step2.education ?? "",
        occupation: draft.step2.occupation ?? "",
        teachingExperienceYears: draft.step2.teachingExperienceYears ?? 0,
        teachingStyle: draft.step2.teachingStyle ?? "",
        subjectsTaught: draft.step2.subjectsTaught ?? "",
        ratePricing: draft.step2.ratePricing ?? "",
        address: draft.step2.address ?? "",
        vehicleType: draft.step2.vehicleType ?? "",
      });
    }
    if (draft.step && draft.step !== "step1") {
      // Only advance if previous steps are actually valid
      const s1Ok = step1Schema.safeParse(step1Form.getValues()).success;
      if (draft.step === "step2" && s1Ok) setStep("step2");
      if (draft.step === "step3") {
        const s2Ok = step2Schema.safeParse(step2Form.getValues()).success;
        if (s1Ok && s2Ok) setStep("step3");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft on every change
  /* eslint-disable react-hooks/incompatible-library */
  useEffect(() => {
    if (!mounted) return;
    const sub1 = step1Form.watch((values) => {
      const s2 = step2Form.getValues();
      safeWriteDraft({
        step,
        step1: values as Step1Values,
        step2: s2,
      });
    });
    const sub2 = step2Form.watch((values) => {
      const s1 = step1Form.getValues();
      safeWriteDraft({
        step,
        step1: s1,
        step2: values as Step2Values,
      });
    });
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [mounted, step, step1Form, step2Form]);
  /* eslint-enable react-hooks/incompatible-library */

  // beforeunload guard — warn if user has typed significant data
  useEffect(() => {
    if (!mounted) return;
    const handler = (ev: BeforeUnloadEvent) => {
      const s1 = step1Form.getValues();
      const hasData =
        s1.firstName?.trim() || s1.phone?.trim() || s1.email?.trim();
      if (hasData && !submitting) {
        ev.preventDefault();
        ev.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [mounted, step1Form, submitting]);

  // --- Step navigation -----------------------------------------------------

  const goToStep2: SubmitHandler<Step1Values> = useCallback(() => {
    setStep("step2");
    requestAnimationFrame(() => {
      document
        .getElementById("tutor-register-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goToStep3: SubmitHandler<Step2Values> = useCallback(() => {
    setStep("step3");
    requestAnimationFrame(() => {
      document
        .getElementById("tutor-register-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((prev) =>
      prev === "step3" ? "step2" : prev === "step2" ? "step1" : "step1",
    );
    requestAnimationFrame(() => {
      document
        .getElementById("tutor-register-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // --- Submit --------------------------------------------------------------

  const submit = useCallback(async () => {
    const s1 = step1Form.getValues();
    const s2 = step2Form.getValues();

    // Re-validate both for safety (should always pass since step gates them)
    const s1Parsed = step1Schema.safeParse(s1);
    const s2Parsed = step2Schema.safeParse(s2);
    if (!s1Parsed.success) {
      setStep("step1");
      toast.error("ข้อมูลขั้นที่ 1 ยังไม่ครบ กรุณาตรวจสอบ");
      return;
    }
    if (!s2Parsed.success) {
      setStep("step2");
      toast.error("ข้อมูลขั้นที่ 2 ยังไม่ครบ กรุณาตรวจสอบ");
      return;
    }

    setSubmitting(true);
    try {
      const credentialUrls = credentials
        .filter((c): c is Extract<UploadState, { status: "uploaded" }> =>
          c.status === "uploaded",
        )
        .map((c) => c.url);

      const documents = {
        ...(resume.status === "uploaded" ? { resume: resume.url } : {}),
        ...(idCard.status === "uploaded" ? { idCard: idCard.url } : {}),
        credentials: credentialUrls,
      };

      const hasAnyDoc =
        !!documents.resume ||
        !!documents.idCard ||
        credentialUrls.length > 0;

      // Profile image isn't in the API schema — for now we append it into
      // credentials[] so it's preserved; admin moves it to profileImageUrl
      // during approval. TODO(phase-4): expand API to accept profileImageUrl.
      if (profileImage.status === "uploaded") {
        documents.credentials = [profileImage.url, ...documents.credentials];
      }

      const payload = {
        firstName: s1Parsed.data.firstName,
        lastName: s1Parsed.data.lastName,
        nickname: s1Parsed.data.nickname,
        ...(s1Parsed.data.gender ? { gender: s1Parsed.data.gender } : {}),
        email: s1Parsed.data.email,
        phone: s1Parsed.data.phone,
        lineId: s1Parsed.data.lineId,
        education: s2Parsed.data.education,
        ...(s2Parsed.data.occupation?.trim()
          ? { occupation: s2Parsed.data.occupation.trim() }
          : {}),
        teachingExperienceYears: s2Parsed.data.teachingExperienceYears,
        ...(s2Parsed.data.teachingStyle?.trim()
          ? { teachingStyle: s2Parsed.data.teachingStyle.trim() }
          : {}),
        subjectsTaught: s2Parsed.data.subjectsTaught,
        ratePricing: s2Parsed.data.ratePricing,
        address: s2Parsed.data.address,
        ...(s2Parsed.data.vehicleType?.trim()
          ? { vehicleType: s2Parsed.data.vehicleType.trim() }
          : {}),
        ...(hasAnyDoc || profileImage.status === "uploaded"
          ? { documents }
          : {}),
      };

      // TODO(phase-6): ga4.event("tutor_register_submit", { has_docs: hasAnyDoc })

      const res = await fetch("/api/tutor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body:
        | { ok: true; data: { id: string; slug: string } }
        | {
            ok: false;
            error: { message: string; details?: unknown };
          }
        | null = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (res.status === 400) {
        const msg =
          (body && "error" in body && body.error?.message) ||
          "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
        toast.error(msg);
        // Surface field-level errors if the API returned them
        const details =
          (body && "error" in body && body.error?.details) ?? null;
        if (details && typeof details === "object") {
          applyFieldErrors(details, step1Form, step2Form);
        }
        return;
      }

      if (res.status === 409) {
        toast.error(
          "มีการสมัครด้วยชื่อหรืออีเมลนี้อยู่แล้ว กรุณาใช้อีเมลอื่น หรือทัก LINE เพื่อให้ทีมตรวจสอบ",
        );
        return;
      }

      if (res.ok && body && "ok" in body && body.ok) {
        safeClearDraft();
        router.push(
          `/tutor-register/success?slug=${encodeURIComponent(body.data.slug)}`,
        );
        return;
      }

      toast.error(
        "ระบบมีปัญหา กรุณาลองใหม่ หรือทักผ่าน LINE เพื่อให้ทีมงานรับเรื่อง",
      );
    } catch (err) {
      console.error("[TutorRegisterForm] submit failed:", err);
      toast.error("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }, [
    step1Form,
    step2Form,
    profileImage,
    idCard,
    resume,
    credentials,
    router,
  ]);

  // --- Credentials helpers --------------------------------------------------

  const addCredentialSlot = useCallback(() => {
    setCredentials((prev) =>
      prev.length >= 5 ? prev : [...prev, { status: "idle" as const }],
    );
  }, []);

  const updateCredential = useCallback(
    (index: number, next: UploadState) => {
      setCredentials((prev) =>
        prev.map((c, i) => (i === index ? next : c)),
      );
    },
    [],
  );

  const removeCredentialSlot = useCallback((index: number) => {
    setCredentials((prev) => {
      if (prev.length <= 1) {
        return [{ status: "idle" as const }];
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const currentMeta = STEP_META[step];
  const StepIcon = currentMeta.icon;

  return (
    <section
      id="tutor-register-form"
      aria-label="ฟอร์มสมัครเป็นติวเตอร์"
      className="rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-sm md:p-8"
    >
      {/* Progress header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]">
              <StepIcon className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                ขั้นตอน {currentMeta.index} จาก 3
              </p>
              <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                {currentMeta.label}
              </p>
            </div>
          </div>
          <span className="text-xs text-[color:var(--color-muted)]">
            {currentMeta.progress}%
          </span>
        </div>
        <Progress
          value={currentMeta.progress}
          className="h-2 bg-[color:var(--color-light-bg)]"
        />
        {/* Step dots for quick visual */}
        <ol className="mt-4 grid grid-cols-3 gap-2">
          {(Object.keys(STEP_META) as Step[]).map((s) => {
            const meta = STEP_META[s];
            const done = meta.index < currentMeta.index;
            const active = meta.index === currentMeta.index;
            return (
              <li
                key={s}
                className={[
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                  active
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-light-bg)] text-[color:var(--color-primary)]"
                    : done
                      ? "border-[color:var(--color-success)]/40 bg-[color:var(--color-success)]/5 text-[color:var(--color-success)]"
                      : "border-[color:var(--color-border)] bg-white text-[color:var(--color-muted)]",
                ].join(" ")}
              >
                {done ? (
                  <CheckCircle2 className="size-4" aria-hidden />
                ) : (
                  <span
                    aria-hidden
                    className={[
                      "inline-flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-[color:var(--color-primary)] text-white"
                        : "bg-[color:var(--color-border)] text-white",
                    ].join(" ")}
                  >
                    {meta.index}
                  </span>
                )}
                <span className="truncate font-medium">{meta.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {step === "step1" && (
        <form
          onSubmit={step1Form.handleSubmit(goToStep2)}
          noValidate
          aria-labelledby="tutor-register-step1-heading"
        >
          <header className="mb-6">
            <h2
              id="tutor-register-step1-heading"
              className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
            >
              ข้อมูลพื้นฐาน
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              เริ่มจากข้อมูลส่วนตัวที่ทีมใช้ติดต่อกลับ
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow>
              <Label htmlFor="firstName" className="text-sm font-semibold">
                ชื่อ <RequiredStar />
              </Label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="ชื่อจริง"
                className="h-11"
                maxLength={100}
                {...step1Form.register("firstName")}
                aria-invalid={!!step1Form.formState.errors.firstName}
              />
              <FieldError message={step1Form.formState.errors.firstName?.message} />
            </FormRow>
            <FormRow>
              <Label htmlFor="lastName" className="text-sm font-semibold">
                นามสกุล <RequiredStar />
              </Label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="นามสกุล"
                className="h-11"
                maxLength={100}
                {...step1Form.register("lastName")}
                aria-invalid={!!step1Form.formState.errors.lastName}
              />
              <FieldError message={step1Form.formState.errors.lastName?.message} />
            </FormRow>
          </div>

          <FormRow>
            <Label htmlFor="nickname" className="text-sm font-semibold">
              ชื่อเล่น <RequiredStar />
            </Label>
            <Input
              id="nickname"
              type="text"
              autoComplete="nickname"
              placeholder="เช่น ครูจอย, ครูท็อป"
              className="h-11"
              maxLength={50}
              {...step1Form.register("nickname")}
              aria-invalid={!!step1Form.formState.errors.nickname}
            />
            <p className="text-xs text-[color:var(--color-muted)]">
              ชื่อเล่นจะใช้แสดงบนโปรไฟล์สาธารณะ
            </p>
            <FieldError message={step1Form.formState.errors.nickname?.message} />
          </FormRow>

          <FormRow>
            <Label className="text-sm font-semibold">
              เพศ{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">
                (ไม่จำเป็น)
              </span>
            </Label>
            <Controller
              control={step1Form.control}
              name="gender"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2" role="group" aria-label="เพศ">
                  {[
                    { value: "MALE", label: "ชาย" },
                    { value: "FEMALE", label: "หญิง" },
                    { value: "OTHER", label: "LGBTQ+ / อื่นๆ" },
                  ].map((opt) => {
                    const selected = field.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(
                            selected
                              ? undefined
                              : (opt.value as "MALE" | "FEMALE" | "OTHER"),
                          )
                        }
                        className={[
                          "inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
                          selected
                            ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                            : "border-[color:var(--color-border)] bg-white text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]/40",
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </FormRow>

          <FormRow>
            <Label htmlFor="email" className="text-sm font-semibold">
              อีเมล <RequiredStar />
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              className="h-11"
              maxLength={200}
              {...step1Form.register("email")}
              aria-invalid={!!step1Form.formState.errors.email}
            />
            <FieldError message={step1Form.formState.errors.email?.message} />
          </FormRow>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow>
              <Label htmlFor="phone" className="text-sm font-semibold">
                เบอร์โทร <RequiredStar />
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="081-234-5678"
                className="h-11 text-base"
                maxLength={20}
                {...step1Form.register("phone")}
                aria-invalid={!!step1Form.formState.errors.phone}
              />
              <FieldError message={step1Form.formState.errors.phone?.message} />
            </FormRow>
            <FormRow>
              <Label htmlFor="lineId" className="text-sm font-semibold">
                LINE ID / Social <RequiredStar />
              </Label>
              <Input
                id="lineId"
                type="text"
                placeholder="@yourid หรือ IG: yourid"
                className="h-11"
                maxLength={100}
                {...step1Form.register("lineId")}
                aria-invalid={!!step1Form.formState.errors.lineId}
              />
              <FieldError message={step1Form.formState.errors.lineId?.message} />
            </FormRow>
          </div>

          <StepFooter>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)] sm:w-auto sm:min-w-[220px]"
            >
              ถัดไป — ข้อมูลการสอน
              <ArrowRight className="size-5" />
            </Button>
          </StepFooter>
        </form>
      )}

      {step === "step2" && (
        <form
          onSubmit={step2Form.handleSubmit(goToStep3)}
          noValidate
          aria-labelledby="tutor-register-step2-heading"
        >
          <header className="mb-6">
            <h2
              id="tutor-register-step2-heading"
              className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
            >
              ข้อมูลการสอน
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              ช่วยเราเข้าใจความเชี่ยวชาญของคุณ เพื่อจับคู่นักเรียนที่เหมาะ
            </p>
          </header>

          <FormRow>
            <Label htmlFor="education" className="text-sm font-semibold">
              วุฒิการศึกษา <RequiredStar />
            </Label>
            <Textarea
              id="education"
              rows={3}
              placeholder="เช่น กำลังศึกษาปริญญาตรี คณะอักษรศาสตร์ จุฬาฯ / จบปริญญาโท วิศวะคอม KMUTT"
              maxLength={500}
              {...step2Form.register("education")}
              aria-invalid={!!step2Form.formState.errors.education}
              className="min-h-[88px]"
            />
            <FieldError message={step2Form.formState.errors.education?.message} />
          </FormRow>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow>
              <Label htmlFor="occupation" className="text-sm font-semibold">
                อาชีพปัจจุบัน{" "}
                <span className="text-xs font-normal text-[color:var(--color-muted)]">
                  (ไม่บังคับ)
                </span>
              </Label>
              <Input
                id="occupation"
                type="text"
                placeholder="เช่น นิสิต / ครูในโรงเรียน / ฟรีแลนซ์"
                className="h-11"
                maxLength={200}
                {...step2Form.register("occupation")}
                aria-invalid={!!step2Form.formState.errors.occupation}
              />
              <FieldError
                message={step2Form.formState.errors.occupation?.message}
              />
            </FormRow>
            <FormRow>
              <Label
                htmlFor="teachingExperienceYears"
                className="text-sm font-semibold"
              >
                ประสบการณ์สอน (ปี) <RequiredStar />
              </Label>
              <Input
                id="teachingExperienceYears"
                type="number"
                inputMode="numeric"
                min={0}
                max={50}
                step={1}
                placeholder="เช่น 2"
                className="h-11"
                {...step2Form.register("teachingExperienceYears", {
                  valueAsNumber: true,
                })}
                aria-invalid={
                  !!step2Form.formState.errors.teachingExperienceYears
                }
              />
              <FieldError
                message={
                  step2Form.formState.errors.teachingExperienceYears?.message
                }
              />
            </FormRow>
          </div>

          <FormRow>
            <Label htmlFor="teachingStyle" className="text-sm font-semibold">
              แนวการสอน{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">
                (ไม่บังคับ)
              </span>
            </Label>
            <Textarea
              id="teachingStyle"
              rows={4}
              placeholder="เล่าว่าคุณสอนแบบไหน ชอบเทคนิคอะไร วิธีอธิบายอย่างไร"
              maxLength={1000}
              {...step2Form.register("teachingStyle")}
              className="min-h-[100px]"
            />
            <FieldError
              message={step2Form.formState.errors.teachingStyle?.message}
            />
          </FormRow>

          <FormRow>
            <div>
              <Label className="text-sm font-semibold">
                วิชาที่สอน <RequiredStar />
              </Label>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                เลือกหมวดหลัก และ/หรือ เพิ่มวิชาเฉพาะทาง (IELTS, SAT, สอบแพทย์ ฯลฯ)
              </p>
            </div>
            <Controller
              control={step2Form.control}
              name="subjectsTaught"
              render={({ field, fieldState }) => (
                <TutorRegisterSubjectsPicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  ariaInvalid={!!fieldState.error}
                  ariaDescribedBy={
                    fieldState.error ? "subjects-taught-error" : undefined
                  }
                />
              )}
            />
            <p
              id="subjects-taught-error"
              aria-live="polite"
              className="min-h-[1em] text-xs text-[color:var(--color-error)]"
            >
              {step2Form.formState.errors.subjectsTaught?.message ?? ""}
            </p>
          </FormRow>

          <FormRow>
            <Label htmlFor="ratePricing" className="text-sm font-semibold">
              อัตราค่าสอน <RequiredStar />
            </Label>
            <Input
              id="ratePricing"
              type="text"
              placeholder="เช่น 500 บาท/ชั่วโมง หรือ 800-1200 บาท ตามระดับชั้น"
              className="h-11"
              maxLength={100}
              {...step2Form.register("ratePricing")}
              aria-invalid={!!step2Form.formState.errors.ratePricing}
            />
            <FieldError
              message={step2Form.formState.errors.ratePricing?.message}
            />
          </FormRow>

          <FormRow>
            <Label htmlFor="address" className="text-sm font-semibold">
              ที่อยู่ / พื้นที่สะดวกเดินทาง <RequiredStar />
            </Label>
            <Textarea
              id="address"
              rows={2}
              placeholder="จังหวัด-เขต เช่น กรุงเทพฯ - พระโขนง หรือ ออนไลน์เท่านั้น"
              maxLength={500}
              {...step2Form.register("address")}
              aria-invalid={!!step2Form.formState.errors.address}
              className="min-h-[80px]"
            />
            <FieldError message={step2Form.formState.errors.address?.message} />
          </FormRow>

          <FormRow>
            <Label htmlFor="vehicleType" className="text-sm font-semibold">
              พาหนะ{" "}
              <span className="text-xs font-normal text-[color:var(--color-muted)]">
                (ไม่บังคับ)
              </span>
            </Label>
            <Controller
              control={step2Form.control}
              name="vehicleType"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) =>
                    field.onChange(v === "__none__" ? "" : v)
                  }
                >
                  <SelectTrigger
                    id="vehicleType"
                    className="h-11 w-full border-[color:var(--color-border)] bg-white"
                  >
                    <SelectValue placeholder="เลือกพาหนะที่ใช้เดินทาง" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="__none__">ไม่ระบุ</SelectItem>
                      <SelectItem value="รถยนต์ส่วนตัว">รถยนต์ส่วนตัว</SelectItem>
                      <SelectItem value="มอเตอร์ไซค์">มอเตอร์ไซค์</SelectItem>
                      <SelectItem value="ขนส่งสาธารณะ">ขนส่งสาธารณะ</SelectItem>
                      <SelectItem value="ไม่สะดวกเดินทาง — สอนออนไลน์">
                        ไม่สะดวกเดินทาง — สอนออนไลน์
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </FormRow>

          <StepFooter>
            <Button
              type="button"
              onClick={goBack}
              variant="outline"
              size="lg"
              className="h-12 border-[color:var(--color-border)] text-[color:var(--color-body)]"
            >
              <ArrowLeft className="size-4" />
              กลับ
            </Button>
            <Button
              type="submit"
              size="lg"
              className="h-12 flex-1 bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)] sm:flex-initial sm:min-w-[220px]"
            >
              ถัดไป — แนบเอกสาร
              <ArrowRight className="size-5" />
            </Button>
          </StepFooter>
        </form>
      )}

      {step === "step3" && (
        <div aria-labelledby="tutor-register-step3-heading">
          <header className="mb-6">
            <h2
              id="tutor-register-step3-heading"
              className="text-xl font-bold text-[color:var(--color-heading)] md:text-2xl"
            >
              แนบเอกสาร (ไม่บังคับ)
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              ถ้ายังไม่พร้อม กดส่งใบสมัครได้เลย —
              ทีมงานจะขอเอกสารเพิ่มผ่าน LINE หลังติดต่อกลับ
            </p>
          </header>

          <div className="rounded-xl bg-[color:var(--color-alt-bg)] p-4 text-xs leading-6 text-[color:var(--color-muted)]">
            <p>
              ไฟล์รูปภาพ: JPEG / PNG / WebP / GIF สูงสุด 5 MB
              · ไฟล์เอกสาร: PDF / JPEG / PNG สูงสุด 10 MB
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            <TutorRegisterFileUpload
              id="upload-profile"
              label="รูปโปรไฟล์"
              kind="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              maxBytes={5 * 1024 * 1024}
              folder="tutors/profiles"
              state={profileImage}
              onStateChange={setProfileImage}
              helperText="รูปชัด มองเห็นใบหน้า จะช่วยให้นักเรียนไว้ใจ"
            />

            <TutorRegisterFileUpload
              id="upload-idcard"
              label="สำเนาบัตรประชาชน"
              kind="document"
              accept="application/pdf,image/jpeg,image/png"
              maxBytes={10 * 1024 * 1024}
              documentCategory="tutor-id-card"
              state={idCard}
              onStateChange={setIdCard}
              helperText="ใช้สำหรับยืนยันตัวตน เก็บเป็นความลับ"
            />

            <TutorRegisterFileUpload
              id="upload-resume"
              label="Resume / CV"
              kind="document"
              accept="application/pdf,image/jpeg,image/png"
              maxBytes={10 * 1024 * 1024}
              documentCategory="tutor-resume"
              state={resume}
              onStateChange={setResume}
              helperText="PDF แนะนำเป็นอย่างยิ่ง"
            />

            {/* Credentials — up to 5 files */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <Label className="text-sm font-semibold">
                  วุฒิการศึกษา / ใบรับรอง{" "}
                  <span className="text-xs font-normal text-[color:var(--color-muted)]">
                    (สูงสุด 5 ไฟล์)
                  </span>
                </Label>
                {credentials.length < 5 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addCredentialSlot}
                    className="text-xs text-[color:var(--color-primary)]"
                  >
                    + เพิ่มช่องอัปโหลด
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                {credentials.map((state, index) => (
                  <div key={index} className="relative">
                    <TutorRegisterFileUpload
                      id={`upload-credential-${index}`}
                      label={`ใบรับรอง #${index + 1}`}
                      kind="document"
                      accept="application/pdf,image/jpeg,image/png"
                      maxBytes={10 * 1024 * 1024}
                      documentCategory="tutor-credentials"
                      state={state}
                      onStateChange={(next) => updateCredential(index, next)}
                      helperText={
                        index === 0
                          ? "Transcript, ใบปริญญา, certificate ฯลฯ"
                          : undefined
                      }
                    />
                    {credentials.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCredentialSlot(index)}
                        className="mt-2 text-xs text-[color:var(--color-muted)]"
                      >
                        ลบช่องนี้
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-[color:var(--color-light-bg)] p-4 text-xs leading-5 text-[color:var(--color-body)]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[color:var(--color-primary)]" />
            <p>
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
              การกดส่งใบสมัครถือว่ายินยอมให้ทีมงานติดต่อกลับ
            </p>
          </div>

          <StepFooter>
            <Button
              type="button"
              onClick={goBack}
              variant="outline"
              size="lg"
              disabled={submitting}
              className="h-12 border-[color:var(--color-border)] text-[color:var(--color-body)]"
            >
              <ArrowLeft className="size-4" />
              กลับ
            </Button>
            <Button
              type="button"
              onClick={submit}
              size="lg"
              disabled={submitting}
              className="h-12 flex-1 bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] hover:bg-[color:var(--color-cta-hover)] disabled:opacity-70 sm:flex-initial sm:min-w-[260px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  กำลังส่งใบสมัคร...
                </>
              ) : (
                <>
                  ส่งใบสมัคร
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </StepFooter>

          {/* Escape hatch */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] pt-5 text-center">
            <p className="text-xs text-[color:var(--color-muted)]">
              ส่งใบสมัครไม่สำเร็จ? ส่งข้อมูลผ่าน LINE ได้เลย
            </p>
            <a
              href={CONTACT_INFO.lineHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-success)]/40 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10"
            >
              <MessageCircle className="size-4" />
              ทัก LINE {CONTACT_INFO.lineId}
            </a>
          </div>
        </div>
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

function RequiredStar() {
  return <span className="text-[color:var(--color-error)]">*</span>;
}

function StepFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
      {children}
    </div>
  );
}

// ---- Helpers ---------------------------------------------------------------

type Step1FormType = ReturnType<typeof useForm<Step1Values>>;
type Step2FormType = ReturnType<typeof useForm<Step2Values>>;

/**
 * Best-effort propagation of API-returned field errors to react-hook-form.
 * Supports two common shapes:
 *   - Zod flatten(): { fieldErrors: { [name]: string[] } }
 *   - Array of issues: [{ path: [name], message }]
 */
function applyFieldErrors(
  details: unknown,
  step1Form: Step1FormType,
  step2Form: Step2FormType,
) {
  const step1Keys: readonly (keyof Step1Values)[] = [
    "firstName",
    "lastName",
    "nickname",
    "email",
    "phone",
    "lineId",
    "gender",
  ];
  const step2Keys: readonly (keyof Step2Values)[] = [
    "education",
    "occupation",
    "teachingExperienceYears",
    "teachingStyle",
    "subjectsTaught",
    "ratePricing",
    "address",
    "vehicleType",
  ];

  const setError = (path: string, message: string) => {
    if ((step1Keys as readonly string[]).includes(path)) {
      step1Form.setError(path as keyof Step1Values, { message });
      return;
    }
    if ((step2Keys as readonly string[]).includes(path)) {
      step2Form.setError(path as keyof Step2Values, { message });
    }
  };

  // Shape 1: Zod flatten (fieldErrors)
  if (
    details &&
    typeof details === "object" &&
    "fieldErrors" in details &&
    details.fieldErrors &&
    typeof details.fieldErrors === "object"
  ) {
    const fe = details.fieldErrors as Record<string, string[] | undefined>;
    for (const [name, messages] of Object.entries(fe)) {
      const msg = Array.isArray(messages) ? messages[0] : undefined;
      if (msg) setError(name, msg);
    }
    return;
  }

  // Shape 2: array of issues ({ path, message })
  if (Array.isArray(details)) {
    for (const issue of details) {
      if (
        issue &&
        typeof issue === "object" &&
        "message" in issue &&
        typeof issue.message === "string"
      ) {
        const path =
          "path" in issue && Array.isArray(issue.path) && typeof issue.path[0] === "string"
            ? (issue.path[0] as string)
            : undefined;
        if (path) setError(path, issue.message);
      }
    }
  }
}

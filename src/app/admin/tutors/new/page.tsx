"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ── Schema (mirrors POST /api/admin/tutors) ────────────────────────────────

const schema = z.object({
  nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50),
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อจริง").max(100),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100),
  profileImageUrl: z.string().trim().optional(),
  subjectsTaught: z.string().trim().min(1, "กรุณากรอกวิชาที่สอน").max(500),
  address: z.string().trim().min(1, "กรุณากรอกจังหวัด").max(200),
  education: z.string().trim().min(1, "กรุณากรอกการศึกษา").max(500),
  teachingStyle: z.string().trim().max(1000).optional(),
  teachingExperienceYears: z.number().int().min(0).max(80),
});

type FormValues = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────

export default function AddTutorPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teachingExperienceYears: 0 },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/admin/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok) {
        setServerError(data.error ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      router.push("/admin/tutors");
      router.refresh();
    } catch {
      setServerError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/admin/tutors">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">เพิ่มติวเตอร์</h1>
          <p className="mt-0.5 text-sm text-[#64748b]">
            ข้อมูลที่กรอกจะแสดงบนหน้าเว็บไซต์ทันที (สถานะ: อนุมัติแล้ว)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ── Name ── */}
        <fieldset className="rounded-xl border border-[#D1D5DB] bg-white p-5">
          <legend className="px-1 text-sm font-semibold text-[#1e293b]">ชื่อ</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Field label="ชื่อเล่น *" error={errors.nickname?.message}>
              <Input placeholder="เช่น ครูวาวา" {...register("nickname")} />
            </Field>
            <Field label="ชื่อจริง *" error={errors.firstName?.message}>
              <Input placeholder="ปณิศา" {...register("firstName")} />
            </Field>
            <Field label="นามสกุล *" error={errors.lastName?.message}>
              <Input placeholder="เจริญสุข" {...register("lastName")} />
            </Field>
          </div>
        </fieldset>

        {/* ── Photo ── */}
        <fieldset className="rounded-xl border border-[#D1D5DB] bg-white p-5">
          <legend className="px-1 text-sm font-semibold text-[#1e293b]">รูปโปรไฟล์</legend>
          <div className="mt-3">
            <Field label="URL รูปภาพ" error={errors.profileImageUrl?.message}>
              <Input
                placeholder="https://res.cloudinary.com/..."
                {...register("profileImageUrl")}
              />
            </Field>
            <p className="mt-1.5 text-xs text-[#94a3b8]">
              วางลิงก์รูปจาก Cloudinary หรือแหล่งอื่น — ถ้ายังไม่มีรูปปล่อยว่างได้ ระบบจะแสดงตัวอักษรย่อแทน
            </p>
          </div>
        </fieldset>

        {/* ── Teaching ── */}
        <fieldset className="rounded-xl border border-[#D1D5DB] bg-white p-5">
          <legend className="px-1 text-sm font-semibold text-[#1e293b]">ข้อมูลการสอน</legend>
          <div className="mt-3 flex flex-col gap-4">
            <Field label="วิชาที่สอน *" error={errors.subjectsTaught?.message}>
              <Input
                placeholder="เช่น ภาษาอังกฤษ, IELTS, TOEIC"
                {...register("subjectsTaught")}
              />
              <p className="mt-1 text-xs text-[#94a3b8]">คั่นหลายวิชาด้วยลูกน้ำ</p>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="จังหวัดที่สอน *" error={errors.address?.message}>
                <Input placeholder="เช่น กรุงเทพมหานคร" {...register("address")} />
              </Field>
              <Field label="ประสบการณ์สอน (ปี) *" error={errors.teachingExperienceYears?.message}>
                <Input
                  type="number"
                  min={0}
                  max={80}
                  placeholder="0"
                  {...register("teachingExperienceYears", { valueAsNumber: true })}
                />
              </Field>
            </div>
          </div>
        </fieldset>

        {/* ── Background ── */}
        <fieldset className="rounded-xl border border-[#D1D5DB] bg-white p-5">
          <legend className="px-1 text-sm font-semibold text-[#1e293b]">ประวัติ</legend>
          <div className="mt-3 flex flex-col gap-4">
            <Field label="การศึกษา *" error={errors.education?.message}>
              <Input
                placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย คณะอักษรศาสตร์"
                {...register("education")}
              />
            </Field>
            <Field label="แนะนำตัว / bio" error={errors.teachingStyle?.message}>
              <Textarea
                rows={4}
                placeholder="เขียนแนะนำตัวสั้นๆ แนวการสอน หรือจุดเด่นของครู..."
                {...register("teachingStyle")}
              />
            </Field>
          </div>
        </fieldset>

        {/* ── Error + Submit ── */}
        {serverError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/tutors">ยกเลิก</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px] bg-[#046bd2] text-white hover:bg-[#045cb4]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Save className="size-4" />
                บันทึกติวเตอร์
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-[#334155]">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

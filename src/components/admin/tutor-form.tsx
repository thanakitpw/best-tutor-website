"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";

// ── Subject groups (slug-based) ───────────────────────────────────────────────

const SUBJECT_GROUPS = [
  {
    category: "ภาษาต่างประเทศ",
    subjects: [
      { slug: "english", name: "ภาษาอังกฤษ" },
      { slug: "chinese", name: "ภาษาจีน" },
      { slug: "japanese", name: "ภาษาญี่ปุ่น" },
      { slug: "korean", name: "ภาษาเกาหลี" },
    ],
  },
  {
    category: "คณิตศาสตร์",
    subjects: [
      { slug: "math-lower-sec", name: "ม.ต้น" },
      { slug: "math-upper-sec", name: "ม.ปลาย" },
      { slug: "math-university", name: "มหาวิทยาลัย" },
    ],
  },
  {
    category: "วิทยาศาสตร์",
    subjects: [
      { slug: "physics", name: "ฟิสิกส์" },
      { slug: "chemistry", name: "เคมี" },
      { slug: "biology", name: "ชีววิทยา" },
    ],
  },
  {
    category: "ภาษาไทย",
    subjects: [
      { slug: "thai-reading", name: "อ่าน" },
      { slug: "thai-writing", name: "เขียน" },
      { slug: "thai-entrance", name: "สอบเข้า" },
    ],
  },
  {
    category: "สังคมศึกษา",
    subjects: [
      { slug: "history", name: "ประวัติศาสตร์" },
      { slug: "economics", name: "เศรษฐศาสตร์" },
      { slug: "law", name: "กฎหมาย" },
    ],
  },
  {
    category: "คอมพิวเตอร์",
    subjects: [
      { slug: "programming", name: "Coding / โปรแกรมมิ่ง" },
      { slug: "computer-basic", name: "พื้นฐานคอมพิวเตอร์" },
    ],
  },
  {
    category: "ศิลปะ",
    subjects: [
      { slug: "drawing", name: "วาดรูป" },
      { slug: "graphic-design", name: "กราฟิกดีไซน์" },
    ],
  },
  {
    category: "ดนตรี",
    subjects: [
      { slug: "guitar", name: "กีตาร์" },
      { slug: "drum", name: "กลอง" },
      { slug: "piano", name: "เปียโน" },
      { slug: "dance", name: "เต้น" },
    ],
  },
  {
    category: "กีฬา",
    subjects: [
      { slug: "swimming", name: "ว่ายน้ำ" },
      { slug: "taekwondo", name: "เทควันโด" },
      { slug: "badminton", name: "แบดมินตัน" },
      { slug: "yoga", name: "โยคะ" },
    ],
  },
] as const;

// ── Thai universities (curated from old site + Partners list) ────────────────

const THAI_UNIVERSITIES = [
  "จุฬาลงกรณ์มหาวิทยาลัย",
  "มหาวิทยาลัยธรรมศาสตร์",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "มหาวิทยาลัยมหิดล",
  "มหาวิทยาลัยศรีนครินทรวิโรฒ",
  "มหาวิทยาลัยศิลปากร",
  "มหาวิทยาลัยรามคำแหง",
  "มหาวิทยาลัยสุโขทัยธรรมาธิราช",
  "มหาวิทยาลัยเชียงใหม่",
  "มหาวิทยาลัยขอนแก่น",
  "มหาวิทยาลัยสงขลานครินทร์",
  "มหาวิทยาลัยบูรพา",
  "มหาวิทยาลัยนเรศวร",
  "มหาวิทยาลัยมหาสารคาม",
  "มหาวิทยาลัยอุบลราชธานี",
  "มหาวิทยาลัยแม่โจ้",
  "มหาวิทยาลัยแม่ฟ้าหลวง",
  "มหาวิทยาลัยพะเยา",
  "มหาวิทยาลัยทักษิณ",
  "มหาวิทยาลัยวลัยลักษณ์",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (KMUTNB)",
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (KMITL)",
  "มหาวิทยาลัยเทคโนโลยีสุรนารี",
  "มหาวิทยาลัยอัสสัมชัญ (ABAC)",
  "มหาวิทยาลัยกรุงเทพ",
  "มหาวิทยาลัยรังสิต",
  "มหาวิทยาลัยศรีปทุม",
  "มหาวิทยาลัยหอการค้าไทย",
  "มหาวิทยาลัยนานาชาติแสตมฟอร์ด",
  "มหาวิทยาลัยต่างประเทศ",
] as const;

const UNIVERSITY_OTHER = "__other__";

// ── Thai provinces ─────────────────────────────────────────────────────────────

const THAI_PROVINCES = [
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
] as const;

// ── Schema ────────────────────────────────────────────────────────────────────

export const tutorFormSchema = z.object({
  nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50),
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อจริง").max(100),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100),
  profileImageUrl: z.string().trim().optional(),
  subjectSlugs: z
    .array(z.string())
    .min(1, "กรุณาเลือกวิชาที่สอนอย่างน้อย 1 วิชา"),
  address: z.string().trim().min(1, "กรุณาเลือกจังหวัด").max(200),
  education: z.string().trim().min(1, "กรุณากรอกการศึกษา").max(500),
  teachingStyle: z.string().trim().max(1000).optional(),
  teachingExperienceYears: z.number().int().min(0).max(80),
});

export type TutorFormValues = z.infer<typeof tutorFormSchema>;

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = "create" | "edit";

interface TutorFormProps {
  mode: Mode;
  tutorId?: string;
  defaultValues?: Partial<TutorFormValues>;
  onSuccess?: () => void;
}

// ── SubjectsSelect ─────────────────────────────────────────────────────────────

function SubjectsSelect({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
}) {
  const selected = new Set(value);

  function toggle(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    onChange(Array.from(next));
  }

  function toggleAll(subjects: readonly { slug: string; name: string }[]) {
    const allSelected = subjects.every((s) => selected.has(s.slug));
    const next = new Set(selected);
    if (allSelected) {
      subjects.forEach((s) => next.delete(s.slug));
    } else {
      subjects.forEach((s) => next.add(s.slug));
    }
    onChange(Array.from(next));
  }

  // Build a name lookup for summary display
  const slugToName = new Map<string, string>(
    SUBJECT_GROUPS.flatMap((g) => g.subjects.map((s) => [s.slug as string, s.name as string])),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-[#334155]">วิชาที่สอน *</Label>
      <div className="rounded-xl border border-[#D1D5DB] bg-white divide-y divide-[#D1D5DB]">
        {SUBJECT_GROUPS.map((group) => {
          const allSelected = group.subjects.every((s) => selected.has(s.slug));
          const someSelected = group.subjects.some((s) => selected.has(s.slug));
          return (
            <div key={group.category} className="px-4 py-3">
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleAll(group.subjects)}
                className="flex items-center gap-2 mb-2.5 group"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-colors ${
                    allSelected
                      ? "bg-[#046bd2] border-[#046bd2] text-white"
                      : someSelected
                        ? "bg-[#046bd2]/20 border-[#046bd2] text-[#046bd2]"
                        : "border-[#D1D5DB] text-transparent group-hover:border-[#046bd2]"
                  }`}
                >
                  {allSelected ? "✓" : someSelected ? "−" : ""}
                </span>
                <span className="text-sm font-semibold text-[#1e293b]">{group.category}</span>
              </button>

              {/* Subject checkboxes */}
              <div className="flex flex-wrap gap-2 pl-6">
                {group.subjects.map((subject) => {
                  const checked = selected.has(subject.slug);
                  return (
                    <button
                      key={subject.slug}
                      type="button"
                      onClick={() => toggle(subject.slug)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        checked
                          ? "bg-[#046bd2] border-[#046bd2] text-white"
                          : "border-[#D1D5DB] text-[#334155] hover:border-[#046bd2] hover:text-[#046bd2]"
                      }`}
                    >
                      {subject.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {selected.size > 0 && (
        <p className="text-xs text-[#64748b]">
          เลือกแล้ว {selected.size} วิชา:{" "}
          {Array.from(selected)
            .map((slug) => slugToName.get(slug) ?? slug)
            .join(", ")}
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── EducationField ─────────────────────────────────────────────────────────────

/**
 * Renders 2 controls (university + faculty) and combines them into a single
 * `education` string for the DB. On mount, tries to split an existing string by
 * matching a known university prefix; unmatched strings drop into the "Other"
 * custom input so no data is lost.
 */
function EducationField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const initial = parseEducation(value);
  const [university, setUniversity] = useState(initial.university);
  const [customUniversity, setCustomUniversity] = useState(initial.customUniversity);
  const [faculty, setFaculty] = useState(initial.faculty);

  function emit(next: { university?: string; customUniversity?: string; faculty?: string }) {
    const u = next.university ?? university;
    const c = next.customUniversity ?? customUniversity;
    const f = next.faculty ?? faculty;
    const uniText = u === UNIVERSITY_OTHER ? c.trim() : u;
    onChange([uniText, f.trim()].filter(Boolean).join(" ").trim());
  }

  return (
    <div className="flex flex-col gap-3">
      <Field label="มหาวิทยาลัย/สถาบัน *" error={error}>
        <Select
          value={university}
          onValueChange={(v) => {
            setUniversity(v);
            emit({ university: v });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกมหาวิทยาลัย/สถาบัน" />
          </SelectTrigger>
          <SelectContent>
            {THAI_UNIVERSITIES.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
            <SelectItem value={UNIVERSITY_OTHER}>อื่น ๆ (กรอกเอง)</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {university === UNIVERSITY_OTHER && (
        <Field label="ระบุชื่อสถาบัน">
          <Input
            placeholder="เช่น Harvard University, สถาบันเทคโนโลยีไทย-ญี่ปุ่น"
            value={customUniversity}
            onChange={(e) => {
              setCustomUniversity(e.target.value);
              emit({ customUniversity: e.target.value });
            }}
          />
        </Field>
      )}

      <Field label="คณะ / สาขา">
        <Input
          placeholder="เช่น คณะวิทยาศาสตร์ สาขาคณิตศาสตร์"
          value={faculty}
          onChange={(e) => {
            setFaculty(e.target.value);
            emit({ faculty: e.target.value });
          }}
        />
      </Field>
    </div>
  );
}

function parseEducation(raw: string): {
  university: string;
  customUniversity: string;
  faculty: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { university: "", customUniversity: "", faculty: "" };
  }
  const match = THAI_UNIVERSITIES.find((u) => trimmed.startsWith(u));
  if (match) {
    return {
      university: match,
      customUniversity: "",
      faculty: trimmed.slice(match.length).trim(),
    };
  }
  return {
    university: UNIVERSITY_OTHER,
    customUniversity: trimmed,
    faculty: "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TutorForm({
  mode,
  tutorId,
  defaultValues,
  onSuccess,
}: TutorFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TutorFormValues>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      nickname: defaultValues?.nickname ?? "",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      profileImageUrl: defaultValues?.profileImageUrl ?? "",
      subjectSlugs: defaultValues?.subjectSlugs ?? [],
      address: defaultValues?.address ?? "",
      education: defaultValues?.education ?? "",
      teachingStyle: defaultValues?.teachingStyle ?? "",
      teachingExperienceYears: defaultValues?.teachingExperienceYears ?? 0,
    },
  });

  async function onSubmit(values: TutorFormValues) {
    setServerError(null);

    if (mode === "edit" && !tutorId) {
      setServerError("ไม่พบรหัสติวเตอร์ ไม่สามารถบันทึกได้");
      return;
    }

    const url =
      mode === "create"
        ? "/api/admin/tutors"
        : `/api/admin/tutors/${tutorId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        const message = data.error ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่";
        setServerError(message);
        toast.error(message);
        return;
      }

      toast.success(
        mode === "create" ? "เพิ่มติวเตอร์เรียบร้อย" : "อัปเดตข้อมูลเรียบร้อย",
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/tutors");
        router.refresh();
      }
    } catch {
      const message = "เกิดข้อผิดพลาด กรุณาลองใหม่";
      setServerError(message);
      toast.error(message);
    }
  }

  return (
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
        <div className="mt-3 flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#334155]">รูปติวเตอร์</Label>
          <Controller
            name="profileImageUrl"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
                folder="tutors/profiles"
                label="อัปโหลดรูปติวเตอร์"
              />
            )}
          />
          {errors.profileImageUrl?.message && (
            <p className="text-xs text-red-600">{errors.profileImageUrl.message}</p>
          )}
          <p className="text-xs text-[#94a3b8]">
            ถ้ายังไม่มีรูปข้ามได้ ระบบจะแสดงตัวอักษรย่อแทน
          </p>
        </div>
      </fieldset>

      {/* ── Teaching ── */}
      <fieldset className="rounded-xl border border-[#D1D5DB] bg-white p-5">
        <legend className="px-1 text-sm font-semibold text-[#1e293b]">ข้อมูลการสอน</legend>
        <div className="mt-3 flex flex-col gap-4">

          {/* Subjects multi-select (slug-based) */}
          <Controller
            name="subjectSlugs"
            control={control}
            render={({ field }) => (
              <SubjectsSelect
                value={field.value}
                onChange={field.onChange}
                error={errors.subjectSlugs?.message}
              />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Province dropdown */}
            <Field label="จังหวัดที่สอน *" error={errors.address?.message}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      {THAI_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field
              label="ประสบการณ์สอน (ปี) *"
              error={errors.teachingExperienceYears?.message}
            >
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
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <EducationField
                value={field.value}
                onChange={field.onChange}
                error={errors.education?.message}
              />
            )}
          />
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
              {mode === "create" ? "บันทึกติวเตอร์" : "บันทึกการแก้ไข"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

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

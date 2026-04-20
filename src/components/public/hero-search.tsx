"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBJECT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "english", label: "ภาษาอังกฤษ" },
  { value: "chinese", label: "ภาษาจีน" },
  { value: "japanese", label: "ภาษาญี่ปุ่น" },
  { value: "korean", label: "ภาษาเกาหลี" },
  { value: "math", label: "คณิตศาสตร์" },
  { value: "science", label: "วิทยาศาสตร์" },
  { value: "physics", label: "ฟิสิกส์" },
  { value: "chemistry", label: "เคมี" },
  { value: "biology", label: "ชีววิทยา" },
  { value: "thai", label: "ภาษาไทย" },
  { value: "social", label: "สังคมศึกษา" },
  { value: "computer", label: "คอมพิวเตอร์" },
  { value: "art", label: "ศิลปะ" },
  { value: "music", label: "ดนตรี" },
];

const GRADE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "kindergarten", label: "อนุบาล" },
  { value: "primary", label: "ประถมศึกษา" },
  { value: "secondary", label: "มัธยมต้น" },
  { value: "high-school", label: "มัธยมปลาย" },
  { value: "university", label: "มหาวิทยาลัย" },
  { value: "working", label: "วัยทำงาน" },
];

const LOCATION_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "online", label: "เรียนออนไลน์" },
  { value: "bangkok", label: "กรุงเทพมหานคร" },
  { value: "nonthaburi", label: "นนทบุรี" },
  { value: "pathumthani", label: "ปทุมธานี" },
  { value: "samutprakan", label: "สมุทรปราการ" },
  { value: "chonburi", label: "ชลบุรี" },
  { value: "chiangmai", label: "เชียงใหม่" },
  { value: "other", label: "จังหวัดอื่น ๆ" },
];

const searchSchema = z.object({
  subject: z.string().optional(),
  grade: z.string().optional(),
  location: z.string().optional(),
});

type SearchValues = z.infer<typeof searchSchema>;

/**
 * HeroSearch — the new Lead-Gen entry point.
 *
 * Replaces the old site's passive "click to find tutor" button with an
 * inline 3-field card that navigates directly to /find-tutor with query
 * params pre-filled (ux-ui-analysis.md §1 + §2: "value before ask").
 */
export function HeroSearch() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { subject: "", grade: "", location: "" },
  });

  const onSubmit = (values: SearchValues) => {
    const params = new URLSearchParams();
    if (values.subject) params.set("subject", values.subject);
    if (values.grade) params.set("grade", values.grade);
    if (values.location) params.set("location", values.location);
    const qs = params.toString();
    router.push(qs ? `/find-tutor?${qs}` : "/find-tutor");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="ค้นหาติวเตอร์"
      className="w-full rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 md:p-6"
    >
      <div className="mb-4">
        <p className="text-sm font-semibold text-[color:var(--color-heading)]">
          ค้นหาติวเตอร์ที่ใช่สำหรับคุณ
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          เลือกข้อมูลคร่าว ๆ เราจะแนะนำติวเตอร์ที่เหมาะสมให้ทันที
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SearchField id="subject" label="วิชาที่สนใจ" placeholder="เลือกวิชา" control={control} name="subject" options={SUBJECT_OPTIONS} />
        <SearchField id="grade" label="ระดับชั้น" placeholder="เลือกระดับชั้น" control={control} name="grade" options={GRADE_OPTIONS} />
        <SearchField id="location" label="พื้นที่สอน" placeholder="เลือกจังหวัด/ออนไลน์" control={control} name="location" options={LOCATION_OPTIONS} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-[color:var(--color-cta)] text-base font-semibold text-[color:var(--color-heading)] shadow-sm hover:bg-[color:var(--color-cta-hover)]"
      >
        <Search className="size-5" />
        ค้นหาติวเตอร์
      </Button>
    </form>
  );
}

// ---- Internal helpers -------------------------------------------------------

type ControllerParams = Parameters<typeof Controller<SearchValues>>[0];

interface SearchFieldProps {
  id: string;
  label: string;
  placeholder: string;
  name: ControllerParams["name"];
  control: ControllerParams["control"];
  options: ReadonlyArray<{ value: string; label: string }>;
}

function SearchField({ id, label, placeholder, name, control, options }: SearchFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-[color:var(--color-body)]">
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger
              id={id}
              className="h-11 w-full border-[color:var(--color-border)] bg-white"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

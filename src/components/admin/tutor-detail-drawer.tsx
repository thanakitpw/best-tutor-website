"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { AdminTutor, TutorStatus } from "@/types/admin";

interface TutorDetailDrawerProps {
  tutor: AdminTutor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: TutorStatus) => Promise<void>;
  actionLoading: string | null;
}

const STATUS_LABELS: Record<TutorStatus, string> = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ปฏิเสธ",
  INACTIVE: "ไม่ใช้งาน",
};

const STATUS_COLORS: Record<TutorStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
};

interface SectionProps {
  title: string;
  rows: { label: string; value?: string | null }[];
}

function Section({ title, rows }: SectionProps) {
  const visible = rows.filter((r) => r.value);
  if (visible.length === 0) return null;
  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#334155]/50">
        {title}
      </p>
      <div className="rounded-lg border border-[#D1D5DB] bg-white divide-y divide-[#D1D5DB]/60">
        {visible.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 px-3 py-2.5">
            <span className="shrink-0 text-xs text-[#64748b]">{row.label}</span>
            <span className="text-sm text-[#1e293b] text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TutorDetailDrawer({
  tutor,
  open,
  onOpenChange,
  onStatusChange,
  actionLoading,
}: TutorDetailDrawerProps) {
  if (!tutor) return null;

  const isLoading = actionLoading === tutor.id;

  const genderLabel =
    tutor.gender === "MALE" ? "ชาย" : tutor.gender === "FEMALE" ? "หญิง" : tutor.gender;

  const expLabel =
    tutor.teachingExperienceYears > 0 ? `${tutor.teachingExperienceYears} ปี` : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg p-0 bg-white">
        <SheetHeader className="shrink-0 border-b border-[#D1D5DB] px-5 py-4">
          <SheetTitle className="text-[#1e293b] text-base">รายละเอียดติวเตอร์</SheetTitle>
          <SheetDescription className="sr-only">ข้อมูลโปรไฟล์ติวเตอร์ทั้งหมด</SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-5">

            {/* Profile overview */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#046bd2]/10 text-[#046bd2] font-bold text-lg">
                {tutor.nickname?.[0] ?? tutor.firstName[0]}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[#1e293b] leading-snug">
                  {tutor.nickname && (
                    <span className="font-normal text-[#64748b]">&ldquo;{tutor.nickname}&rdquo; </span>
                  )}
                  {tutor.firstName} {tutor.lastName}
                </p>
                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[tutor.status]}`}
                >
                  {STATUS_LABELS[tutor.status]}
                </span>
              </div>
            </div>

            <Section
              title="ข้อมูลติดต่อ"
              rows={[
                { label: "อีเมล", value: tutor.email },
                { label: "เบอร์โทร", value: tutor.phone },
                { label: "Line ID", value: tutor.lineId },
              ]}
            />

            <Section
              title="ข้อมูลส่วนตัว"
              rows={[
                { label: "เพศ", value: genderLabel },
                { label: "การศึกษา", value: tutor.education },
                { label: "อาชีพ", value: tutor.occupation },
                { label: "ประสบการณ์สอน", value: expLabel },
                { label: "สไตล์การสอน", value: tutor.teachingStyle },
              ]}
            />

            <Section
              title="วิชาที่สอน"
              rows={[
                { label: "วิชาที่สอน", value: tutor.subjectsTaught },
              ]}
            />

            <Section
              title="ที่อยู่และการเดินทาง"
              rows={[
                { label: "ที่อยู่", value: tutor.address },
                { label: "ยานพาหนะ", value: tutor.vehicleType },
              ]}
            />

          </div>
        </div>

        {/* Fixed footer */}
        {tutor.status !== "APPROVED" && tutor.status !== "REJECTED" && (
          <div className="shrink-0 border-t border-[#D1D5DB] px-5 py-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => onStatusChange(tutor.id, "APPROVED")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "กำลังดำเนินการ..." : "อนุมัติ"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isLoading}
                onClick={() => onStatusChange(tutor.id, "REJECTED")}
                className="flex-1"
              >
                {isLoading ? "..." : "ปฏิเสธ"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

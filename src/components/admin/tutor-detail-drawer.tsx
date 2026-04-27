"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
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

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-[#334155]/60 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-[#1e293b]">{value}</span>
    </div>
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b border-[#D1D5DB]">
          <SheetTitle className="text-[#1e293b] text-base">
            รายละเอียดติวเตอร์
          </SheetTitle>
          <SheetDescription className="sr-only">
            ข้อมูลโปรไฟล์ติวเตอร์ทั้งหมด
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-4 px-1">
          {/* Profile overview */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#046bd2]/10 text-[#046bd2] font-semibold text-lg">
              {tutor.nickname?.[0] ?? tutor.firstName[0]}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[#1e293b]">
                {tutor.nickname && `"${tutor.nickname}" `}
                {tutor.firstName} {tutor.lastName}
              </p>
              <span
                className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[tutor.status]}`}
              >
                {STATUS_LABELS[tutor.status]}
              </span>
            </div>
          </div>

          {/* Contact */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#334155]/50">
              ข้อมูลติดต่อ
            </p>
            <div className="flex flex-col gap-2 rounded-lg border border-[#D1D5DB] bg-white p-3">
              <DetailRow label="อีเมล" value={tutor.email} />
              <DetailRow label="เบอร์โทร" value={tutor.phone} />
              <DetailRow label="Line ID" value={tutor.lineId} />
            </div>
          </section>

          {/* Personal info */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#334155]/50">
              ข้อมูลส่วนตัว
            </p>
            <div className="flex flex-col gap-2 rounded-lg border border-[#D1D5DB] bg-white p-3">
              <DetailRow label="เพศ" value={tutor.gender === "MALE" ? "ชาย" : tutor.gender === "FEMALE" ? "หญิง" : tutor.gender} />
              <DetailRow label="การศึกษา" value={tutor.education} />
              <DetailRow label="อาชีพ" value={tutor.occupation} />
              <DetailRow
                label="ประสบการณ์สอน"
                value={tutor.teachingExperience != null ? `${tutor.teachingExperience} ปี` : undefined}
              />
              <DetailRow label="สไตล์การสอน" value={tutor.teachingStyle} />
            </div>
          </section>

          {/* Teaching info */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#334155]/50">
              วิชาและค่าสอน
            </p>
            <div className="flex flex-col gap-2 rounded-lg border border-[#D1D5DB] bg-white p-3">
              <DetailRow label="วิชาที่สอน" value={tutor.subjectsTaught} />
              <DetailRow label="ราคา" value={tutor.ratePricing} />
            </div>
          </section>

          {/* Location */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#334155]/50">
              ที่อยู่และการเดินทาง
            </p>
            <div className="flex flex-col gap-2 rounded-lg border border-[#D1D5DB] bg-white p-3">
              <DetailRow label="ที่อยู่" value={tutor.address} />
              <DetailRow label="ยานพาหนะ" value={tutor.vehicleType} />
            </div>
          </section>

          {/* Actions */}
          {tutor.status !== "APPROVED" && tutor.status !== "REJECTED" && (
            <div className="flex gap-2 pt-2 border-t border-[#D1D5DB]">
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
                {isLoading ? "กำลังดำเนินการ..." : "ปฏิเสธ"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

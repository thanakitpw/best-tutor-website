"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TutorForm } from "@/components/admin/tutor-form";

export default function AddTutorPage() {
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

      <TutorForm mode="create" />
    </div>
  );
}

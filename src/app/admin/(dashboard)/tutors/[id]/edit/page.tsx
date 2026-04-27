"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TutorForm, type TutorFormValues } from "@/components/admin/tutor-form";
import type { AdminTutor, ApiEnvelope } from "@/types/admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; tutor: AdminTutor }
  | { status: "not-found" }
  | { status: "error"; message: string };

export default function EditTutorPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [state, setState] = useState<LoadState>(() =>
    id ? { status: "loading" } : { status: "not-found" },
  );

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/admin/tutors/${id}`);
        if (cancelled) return;

        if (res.status === 404) {
          setState({ status: "not-found" });
          return;
        }

        if (!res.ok) {
          setState({
            status: "error",
            message: "โหลดข้อมูลติวเตอร์ไม่สำเร็จ กรุณาลองใหม่",
          });
          return;
        }

        const env = (await res.json()) as ApiEnvelope<AdminTutor>;
        if (cancelled) return;
        if (!env.ok) {
          setState({
            status: "error",
            message: env.error ?? "โหลดข้อมูลไม่สำเร็จ",
          });
          return;
        }
        setState({ status: "ready", tutor: env.data });
      } catch {
        if (cancelled) return;
        setState({
          status: "error",
          message: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/admin/tutors" aria-label="กลับไปหน้ารายการติวเตอร์">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">แก้ไขติวเตอร์</h1>
          <p className="mt-0.5 text-sm text-[#64748b]">
            อัปเดตข้อมูลโปรไฟล์ — บันทึกแล้วจะแสดงบนเว็บไซต์ทันที
          </p>
        </div>
      </div>

      {state.status === "loading" && (
        <div className="flex items-center justify-center rounded-xl border border-[#D1D5DB] bg-white py-16">
          <Loader2 className="size-6 animate-spin text-[#046bd2]" />
          <span className="ml-3 text-sm text-[#64748b]">
            กำลังโหลดข้อมูลติวเตอร์...
          </span>
        </div>
      )}

      {state.status === "not-found" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            ไม่พบติวเตอร์รายนี้
          </h2>
          <p className="mt-2 text-sm text-red-700">
            ข้อมูลอาจถูกลบแล้ว หรือ URL ไม่ถูกต้อง
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-4"
          >
            <Link href="/admin/tutors">กลับไปหน้ารายการ</Link>
          </Button>
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{state.message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            ลองใหม่
          </Button>
        </div>
      )}

      {state.status === "ready" && id && (
        <TutorForm
          mode="edit"
          tutorId={id}
          defaultValues={toFormValues(state.tutor)}
        />
      )}
    </div>
  );
}

// ── Helper ───────────────────────────────────────────────────────────────────

function toFormValues(tutor: AdminTutor): Partial<TutorFormValues> {
  return {
    nickname: tutor.nickname ?? "",
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    profileImageUrl: tutor.profileImageUrl ?? "",
    subjectsTaught: tutor.subjectsTaught ?? "",
    address: tutor.address ?? "",
    education: tutor.education ?? "",
    teachingStyle: tutor.teachingStyle ?? "",
    teachingExperienceYears: tutor.teachingExperienceYears ?? 0,
  };
}

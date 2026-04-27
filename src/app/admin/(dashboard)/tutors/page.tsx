"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TutorBulkActions } from "@/components/admin/tutor-bulk-actions";
import { TutorDetailDrawer } from "@/components/admin/tutor-detail-drawer";
import type {
  AdminTutor,
  AdminTutorsResponse,
  ApiEnvelope,
  TutorStatus,
} from "@/types/admin";

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

const STATUS_TABS: { value: string; label: string; status?: TutorStatus }[] = [
  { value: "ALL", label: "ทั้งหมด" },
  { value: "PENDING", label: "รอตรวจ", status: "PENDING" },
  { value: "APPROVED", label: "อนุมัติ", status: "APPROVED" },
  { value: "REJECTED", label: "ปฏิเสธ", status: "REJECTED" },
];

const STATUS_BADGE_CLASS: Record<TutorStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border border-green-200",
  REJECTED: "bg-red-100 text-red-800 border border-red-200",
  INACTIVE: "bg-gray-100 text-gray-600 border border-gray-200",
};

const STATUS_LABEL: Record<TutorStatus, string> = {
  PENDING: "รอตรวจ",
  APPROVED: "อนุมัติ",
  REJECTED: "ปฏิเสธ",
  INACTIVE: "ไม่ใช้งาน",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminTutorsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminTutorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminTutor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      const res = await fetch(`/api/admin/tutors?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch tutors");
      const env = (await res.json()) as ApiEnvelope<AdminTutorsResponse>;
      if (env.ok) {
        setData(env.data);
      }
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  async function handleStatusChange(id: string, status: TutorStatus) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/tutors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Optimistic update
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((t) =>
                t.id === id ? { ...t, status } : t
              ),
            }
          : prev
      );
      // Also update selected tutor if open
      setSelectedTutor((prev) =>
        prev?.id === id ? { ...prev, status } : prev
      );
    } catch {
      // silent error — list will reflect old state
    } finally {
      setActionLoading(null);
    }
  }

  function openDetail(tutor: AdminTutor) {
    setSelectedTutor(tutor);
    setDrawerOpen(true);
  }

  function openDeleteDialog(tutor: AdminTutor) {
    setDeleteTarget(tutor);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tutors/${target.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        toast.error(data.error ?? "ลบติวเตอร์ไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      // Remove from local state
      setData((prev) =>
        prev
          ? {
              ...prev,
              total: Math.max(0, prev.total - 1),
              items: prev.items.filter((t) => t.id !== target.id),
            }
          : prev,
      );

      // Close drawer if it was showing this tutor
      setSelectedTutor((prev) => (prev?.id === target.id ? null : prev));

      toast.success("ลบติวเตอร์เรียบร้อย");
      setDeleteTarget(null);
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setDeleting(false);
    }
  }

  const tutors = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#046bd2]/10">
            <Users className="size-5 text-[#046bd2]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#1e293b]">
              จัดการติวเตอร์
            </h1>
            {data && (
              <p className="text-xs text-[#334155]/60">
                ทั้งหมด {data.total} คน
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TutorBulkActions onImportSuccess={fetchTutors} />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTutors}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
          <Button
            asChild
            size="sm"
            className="gap-1.5 bg-[#046bd2] text-white hover:bg-[#045cb4]"
          >
            <Link href="/admin/tutors/new">
              <Plus className="size-4" />
              เพิ่มติวเตอร์
            </Link>
          </Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <TabsList className="h-9 bg-white border border-[#D1D5DB] p-0.5 gap-0.5">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-8 px-4 text-sm font-medium text-[#64748b] data-[state=active]:bg-white data-[state=active]:text-[#046bd2] data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-md transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <div className="rounded-xl border border-[#D1D5DB] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1D5DB] bg-[#F0F5FA]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#334155]/60">
                  ติวเตอร์
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#334155]/60 hidden md:table-cell">
                  วิชา
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#334155]/60 hidden lg:table-cell">
                  จังหวัด
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#334155]/60">
                  สถานะ
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#334155]/60 hidden md:table-cell">
                  วันที่สมัคร
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#334155]/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1D5DB]">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Skeleton className="h-3 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-7 w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : tutors.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-[#334155]/50"
                  >
                    ไม่พบข้อมูลติวเตอร์
                  </td>
                </tr>
              ) : (
                tutors.map((tutor) => (
                  <TutorRow
                    key={tutor.id}
                    tutor={tutor}
                    onStatusChange={handleStatusChange}
                    onViewDetail={openDetail}
                    onDelete={openDeleteDialog}
                    actionLoading={actionLoading}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && data && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#D1D5DB] px-4 py-3">
            <p className="text-xs text-[#334155]/60">
              แสดง {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, data.total)} จาก {data.total} รายการ
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ก่อนหน้า
              </Button>
              <span className="px-3 text-xs text-[#334155]">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <TutorDetailDrawer
        tutor={selectedTutor}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
        actionLoading={actionLoading}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบติวเตอร์?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `ข้อมูลติวเตอร์ "${
                    deleteTarget.nickname ?? deleteTarget.firstName
                  }" จะถูกลบถาวร และจะไม่แสดงในเว็บไซต์อีก ดำเนินการต่อ?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                "ลบถาวร"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── TutorRow sub-component ────────────────────────────────────────────────────

interface TutorRowProps {
  tutor: AdminTutor;
  onStatusChange: (id: string, status: TutorStatus) => Promise<void>;
  onViewDetail: (tutor: AdminTutor) => void;
  onDelete: (tutor: AdminTutor) => void;
  actionLoading: string | null;
}

function TutorRow({
  tutor,
  onStatusChange,
  onViewDetail,
  onDelete,
  actionLoading,
}: TutorRowProps) {
  const isLoading = actionLoading === tutor.id;

  const province = tutor.address
    ? tutor.address.split(" ").slice(-1)[0]
    : null;

  const createdDate = new Date(tutor.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="hover:bg-[#F0F5FA]/50 transition-colors">
      {/* ชื่อ */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#046bd2]/10 text-[#046bd2] text-xs font-semibold">
            {tutor.nickname?.[0] ?? tutor.firstName[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[#1e293b] leading-tight">
              {tutor.nickname ? `"${tutor.nickname}" ` : ""}
              {tutor.firstName}
            </span>
            <span className="text-xs text-[#334155]/60">{tutor.lastName}</span>
          </div>
        </div>
      </td>

      {/* วิชา */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-[#334155] line-clamp-1 max-w-[140px]">
          {tutor.subjectsTaught ?? "—"}
        </span>
      </td>

      {/* จังหวัด */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-[#334155]">{province ?? "—"}</span>
      </td>

      {/* สถานะ */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[tutor.status]}`}
        >
          {STATUS_LABEL[tutor.status]}
        </span>
      </td>

      {/* วันที่ */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-[#334155]/60">{createdDate}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          {tutor.status === "PENDING" && (
            <>
              <Button
                size="xs"
                disabled={isLoading}
                onClick={() => onStatusChange(tutor.id, "APPROVED")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "..." : "อนุมัติ"}
              </Button>
              <Button
                size="xs"
                variant="destructive"
                disabled={isLoading}
                onClick={() => onStatusChange(tutor.id, "REJECTED")}
              >
                {isLoading ? "..." : "ปฏิเสธ"}
              </Button>
            </>
          )}
          <Button
            size="xs"
            variant="outline"
            onClick={() => onViewDetail(tutor)}
          >
            รายละเอียด
          </Button>
          <Button
            asChild
            size="xs"
            variant="outline"
            title="แก้ไข"
          >
            <Link href={`/admin/tutors/${tutor.id}/edit`}>
              <Pencil className="size-3" />
              แก้ไข
            </Link>
          </Button>
          <Button
            size="icon-xs"
            variant="outline"
            onClick={() => onDelete(tutor)}
            title="ลบ"
            aria-label="ลบติวเตอร์"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

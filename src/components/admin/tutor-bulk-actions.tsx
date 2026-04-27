"use client";

/**
 * Bulk operations for the admin tutor list:
 *   • Export CSV       → GET /api/admin/tutors/export
 *   • Download Template → GET /api/admin/tutors/export?template=true
 *   • Import CSV       → POST /api/admin/tutors/import (multipart)
 *
 * Import flow: pick file → preview first 5 rows → submit → show summary
 * (created / updated / failed). Failed rows are listed with their original
 * Excel row number so the user can fix the sheet without re-importing
 * everything.
 */

import { useRef, useState } from "react";
import { Download, FileDown, Loader2, Upload, X } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TutorImportResult } from "@/app/api/admin/tutors/import/route";

const PREVIEW_ROWS = 5;

interface TutorBulkActionsProps {
  /** Refetch the list after an import completes. */
  onImportSuccess?: () => void;
}

export function TutorBulkActions({ onImportSuccess }: TutorBulkActionsProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TutorImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    window.location.href = "/api/admin/tutors/export";
  }

  function handleTemplate() {
    window.location.href = "/api/admin/tutors/export?template=true";
  }

  function resetImportState() {
    setFile(null);
    setPreview([]);
    setPreviewError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleOpenChange(next: boolean) {
    if (submitting) return;
    setOpen(next);
    if (!next) resetImportState();
  }

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setPreview([]);
    setPreviewError(null);
    setResult(null);
    if (!picked) return;

    try {
      const text = await picked.text();
      const cleaned = text.replace(/^﻿/, "");
      const parsed = Papa.parse<Record<string, string>>(cleaned, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (h) => h.trim(),
        preview: PREVIEW_ROWS,
      });
      if (parsed.errors.length > 0) {
        setPreviewError(parsed.errors[0]?.message ?? "อ่านไฟล์ไม่ได้");
        return;
      }
      setPreview(parsed.data);
    } catch {
      setPreviewError("อ่านไฟล์ไม่ได้");
    }
  }

  async function handleImport() {
    if (!file) return;
    setSubmitting(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/tutors/import", {
        method: "POST",
        body: formData,
      });
      const env = (await res.json().catch(() => ({}))) as
        | { ok: true; data: TutorImportResult }
        | { ok: false; error?: string };
      if (!res.ok || !("ok" in env) || !env.ok) {
        const message =
          ("error" in env && env.error) ||
          "นำเข้าไม่สำเร็จ กรุณาลองใหม่";
        toast.error(message);
        return;
      }
      setResult(env.data);
      const { created, updated, skipped } = env.data;
      toast.success(
        `นำเข้าเสร็จ — สร้าง ${created}, อัปเดต ${updated}, ข้าม ${skipped}`,
      );
      onImportSuccess?.();
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  // Header keys to preview (derived from first row to avoid hard-coding).
  const previewHeaders = preview[0] ? Object.keys(preview[0]) : [];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="gap-1.5"
      >
        <Download className="size-4" />
        ส่งออก CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <Upload className="size-4" />
        นำเข้า CSV
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>นำเข้าติวเตอร์จากไฟล์ CSV</DialogTitle>
            <DialogDescription>
              อัปโหลดไฟล์ CSV เพื่อสร้างหรืออัปเดตติวเตอร์เป็นชุด — แถวที่
              ข้อมูลผิดจะถูกข้าม ระบบจะแจ้งหมายเลขแถวให้แก้
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: file picker + template link */}
          <div className="flex flex-col gap-3">
            {!result && (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-[#1e293b]">
                      ยังไม่มี template?
                    </p>
                    <p className="text-xs text-[#64748b]">
                      ดาวน์โหลดไฟล์ตัวอย่างก่อน เพื่อให้ header ถูกต้อง
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTemplate}
                    className="gap-1.5 shrink-0"
                  >
                    <FileDown className="size-4" />
                    ดาวน์โหลด Template
                  </Button>
                </div>
              </div>
            )}

            {!result && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#334155]">
                  เลือกไฟล์ CSV (สูงสุด 5MB / 1,000 แถว)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFilePick}
                  disabled={submitting}
                  className="block w-full text-sm text-[#334155] file:mr-3 file:rounded-md file:border-0 file:bg-[#046bd2] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#045cb4] disabled:opacity-50"
                />
                {previewError && (
                  <p className="text-xs text-red-600">{previewError}</p>
                )}
              </div>
            )}

            {/* Preview */}
            {!result && preview.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-[#64748b]">
                  ตัวอย่าง 5 แถวแรก:
                </p>
                <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F0F5FA]">
                      <tr>
                        {previewHeaders.slice(0, 5).map((h) => (
                          <th
                            key={h}
                            className="px-2 py-1.5 text-left font-semibold text-[#334155]"
                          >
                            {h}
                          </th>
                        ))}
                        {previewHeaders.length > 5 && (
                          <th className="px-2 py-1.5 text-left text-[#64748b]">
                            +{previewHeaders.length - 5} คอลัมน์
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-[#E2E8F0] text-[#334155]"
                        >
                          {previewHeaders.slice(0, 5).map((h) => (
                            <td
                              key={h}
                              className="max-w-[120px] truncate px-2 py-1.5"
                            >
                              {row[h] || "—"}
                            </td>
                          ))}
                          {previewHeaders.length > 5 && (
                            <td className="px-2 py-1.5 text-[#94a3b8]">…</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Result summary */}
            {result && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <Stat label="สร้างใหม่" value={result.created} tone="green" />
                  <Stat label="อัปเดต" value={result.updated} tone="blue" />
                  <Stat label="ข้าม" value={result.skipped} tone="red" />
                </div>
                {result.failed.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-[#334155]">
                      แถวที่ผิดพลาด ({result.failed.length}):
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-2">
                      <ul className="flex flex-col gap-1 text-xs text-red-700">
                        {result.failed.map((f) => (
                          <li key={f.row}>
                            <span className="font-semibold">แถว {f.row}:</span>{" "}
                            {f.errors.join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {result ? (
              <Button onClick={() => handleOpenChange(false)}>เสร็จสิ้น</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={submitting}
                >
                  <X className="size-4" />
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || submitting || preview.length === 0}
                  className="bg-[#046bd2] text-white hover:bg-[#045cb4]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      กำลังนำเข้า...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      เริ่มนำเข้า
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "blue" | "red";
}) {
  const palette: Record<typeof tone, string> = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-center ${palette[tone]}`}
    >
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

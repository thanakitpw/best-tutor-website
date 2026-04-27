"use client";

/**
 * Image picker with client-side compression + Cloudinary upload.
 *
 * Flow:
 *   1. User picks file (or drops onto zone)
 *   2. browser-image-compression resizes to ≤1200×1200, quality 0.85
 *   3. POST compressed blob to /api/admin/upload/image
 *   4. Server forwards to Cloudinary, returns secureUrl
 *   5. Component calls onChange(secureUrl)
 *
 * Compression in the browser saves Vercel bandwidth and Cloudinary storage —
 * a 5MB iPhone photo typically lands at ~300-500KB before it even leaves the
 * device. Cloudinary then re-encodes to WebP/AVIF on delivery via `f_auto`.
 */

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { UploadImageResponse } from "@/app/api/admin/upload/image/route";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5, // target ≤500KB after compression
  maxWidthOrHeight: 1200, // enough for hero / profile presets
  useWebWorker: true,
  initialQuality: 0.85,
};

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Cloudinary folder. Defaults to tutors/profiles. */
  folder?: string;
  /** Accessible label for the picker button. */
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "tutors/profiles",
  label = "เลือกรูป",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์ jpg, png, webp, avif");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("ไฟล์ใหญ่เกิน 20MB กรุณาเลือกไฟล์อื่น");
      return;
    }

    setUploading(true);
    try {
      // --- 1. Compress in browser ------------------------------------------
      setProgress(`กำลังย่อขนาด... (${formatBytes(file.size)})`);
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

      // --- 2. Upload to our API --------------------------------------------
      setProgress(`กำลังอัปโหลด... (${formatBytes(compressed.size)})`);
      const formData = new FormData();
      formData.append("file", compressed, compressed.name || file.name);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload/image", {
        method: "POST",
        body: formData,
      });
      const env = (await res.json().catch(() => ({}))) as
        | { ok: true; data: UploadImageResponse }
        | { ok: false; error?: string };
      if (!res.ok || !("ok" in env) || !env.ok) {
        const message =
          ("error" in env && env.error) || "อัปโหลดไม่สำเร็จ";
        toast.error(message);
        return;
      }

      onChange(env.data.secureUrl);
      toast.success(
        `อัปโหลดเสร็จ ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ";
      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) handleFile(file);
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME.join(",")}
        onChange={handleInputChange}
        disabled={uploading}
        className="hidden"
      />

      {value ? (
        // --- Preview state ----------------------------------------------------
        <div className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="size-24 shrink-0 rounded-lg border border-[#E2E8F0] object-cover"
          />
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs text-[#64748b] break-all line-clamp-2">
              {value}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="gap-1.5"
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                เปลี่ยนรูป
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="size-3.5" />
                ลบ
              </Button>
            </div>
            {progress && (
              <p className="text-xs text-[#046bd2]">{progress}</p>
            )}
          </div>
        </div>
      ) : (
        // --- Empty / drop zone -----------------------------------------------
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !uploading) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragOver
              ? "border-[#046bd2] bg-[#046bd2]/5"
              : "border-[#D1D5DB] bg-[#F8FAFC] hover:border-[#046bd2] hover:bg-[#046bd2]/5"
          } ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        >
          {uploading ? (
            <>
              <Loader2 className="size-6 animate-spin text-[#046bd2]" />
              <p className="text-sm text-[#046bd2]">{progress ?? "กำลังประมวลผล..."}</p>
            </>
          ) : (
            <>
              <div className="flex size-10 items-center justify-center rounded-full bg-[#046bd2]/10">
                <ImageIcon className="size-5 text-[#046bd2]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1e293b]">{label}</p>
                <p className="mt-0.5 text-xs text-[#64748b]">
                  ลากไฟล์มาวาง หรือคลิกเพื่อเลือก — jpg, png, webp (≤20MB)
                </p>
                <p className="mt-0.5 text-xs text-[#94a3b8]">
                  ระบบจะย่อให้อัตโนมัติเป็น ≤500KB ก่อนอัปโหลด
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

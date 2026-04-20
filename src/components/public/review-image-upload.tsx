"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Matches the server-side constraints in src/app/api/upload/route.ts
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
const ACCEPT_ATTR = ACCEPTED_MIME.join(",");

type SlotStatus = "uploading" | "error";

interface TransientSlot {
  id: string;
  status: SlotStatus;
  /** Local preview (object URL) while uploading + on failure. */
  previewUrl: string;
  errorMessage?: string;
}

export interface ReviewImageUploadProps {
  /** List of uploaded image URLs (Cloudinary secure URLs). */
  value: string[];
  /** Fired when the uploaded set changes. */
  onChange: (urls: string[]) => void;
  /** Maximum images allowed. Defaults to 5. */
  maxCount?: number;
  /** Disable the uploader entirely (e.g. while parent form submits). */
  disabled?: boolean;
  className?: string;
}

/**
 * Multi-image uploader with per-slot state machine + lightbox.
 *
 * Per-slot state machine (for transient slots only — successful uploads
 * immediately graduate into `value`):
 *   idle → uploading → uploaded ✓  (slot removed from local state)
 *                   ↘ error       (slot stays so user can retry)
 *
 * Server contract: POST /api/upload with multipart `file`, `kind=image`,
 * `folder=reviews`. Response `{ ok: true, data: { secureUrl | secure_url } }`.
 *
 * NOTE (Phase 3.9): the upload API currently requires auth (see
 * `/api/upload/route.ts#requireAuth`). Anonymous submissions will receive 401
 * and we surface that as a clear inline error. The Backend team owns adding
 * a public `folder=reviews` code path — see TODO below.
 */
export function ReviewImageUpload({
  value,
  onChange,
  maxCount = 5,
  disabled,
  className,
}: ReviewImageUploadProps) {
  const [transient, setTransient] = useState<TransientSlot[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalUsed = value.length + transient.filter((s) => s.status === "uploading").length;
  const remaining = Math.max(0, maxCount - totalUsed);
  const canUpload = !disabled && remaining > 0;

  const upsertTransient = useCallback((next: TransientSlot) => {
    setTransient((prev) => {
      const existing = prev.findIndex((s) => s.id === next.id);
      if (existing === -1) return [...prev, next];
      const copy = prev.slice();
      copy[existing] = next;
      return copy;
    });
  }, []);

  const removeTransient = useCallback((id: string) => {
    setTransient((prev) => {
      const match = prev.find((s) => s.id === id);
      if (match) URL.revokeObjectURL(match.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const uploadOne = useCallback(
    async (file: File) => {
      // Client-side guards mirror the server's validation so we can fail fast.
      if (!(ACCEPTED_MIME as readonly string[]).includes(file.type)) {
        toast.error(`ไฟล์ "${file.name}" ไม่รองรับ — ใช้เฉพาะ JPG / PNG / WEBP`);
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`ไฟล์ "${file.name}" ใหญ่เกิน 5 MB`);
        return;
      }

      const slotId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const previewUrl = URL.createObjectURL(file);
      upsertTransient({ id: slotId, status: "uploading", previewUrl });

      try {
        const form = new FormData();
        form.append("file", file);
        form.append("kind", "image");
        form.append("folder", "reviews");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        const body = (await res.json().catch(() => null)) as
          | {
              ok: true;
              data:
                | { secureUrl: string; publicId?: string }
                | { secure_url: string; public_id?: string };
            }
          | { ok: false; error?: { message?: string } | string }
          | null;

        if (!res.ok || !body || !("ok" in body) || !body.ok) {
          // Extract server message when present
          const serverMsg =
            body && "error" in body
              ? typeof body.error === "string"
                ? body.error
                : body.error?.message
              : undefined;

          const userMsg =
            res.status === 401 || res.status === 403
              ? "ยังเปิดให้แนบรูปเฉพาะผู้ใช้ที่ล็อกอิน — จะเปิดให้ทุกคนเร็วๆ นี้"
              : res.status === 413
                ? "ไฟล์ใหญ่เกิน 5 MB"
                : res.status === 415
                  ? "ประเภทไฟล์ไม่รองรับ"
                  : (serverMsg ?? "อัปโหลดไม่สำเร็จ");
          upsertTransient({
            id: slotId,
            status: "error",
            previewUrl,
            errorMessage: userMsg,
          });
          return;
        }

        // Cloudinary result — the route returns camelCase or snake_case depending
        // on how the library was wrapped. Accept both so we stay resilient.
        const data = body.data as {
          secureUrl?: string;
          secure_url?: string;
        };
        const url = data.secureUrl ?? data.secure_url;
        if (!url) {
          upsertTransient({
            id: slotId,
            status: "error",
            previewUrl,
            errorMessage: "ไม่ได้ URL ของรูปที่อัปโหลด",
          });
          return;
        }

        // Success — add URL to value, remove transient slot
        onChange([...value, url]);
        URL.revokeObjectURL(previewUrl);
        setTransient((prev) => prev.filter((s) => s.id !== slotId));
      } catch (err) {
        console.error("[ReviewImageUpload] upload failed:", err);
        upsertTransient({
          id: slotId,
          status: "error",
          previewUrl,
          errorMessage: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
        });
      }
    },
    [onChange, upsertTransient, value],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const pick = Array.from(files).slice(0, remaining);
      if (pick.length < files.length) {
        toast.error(`เลือกได้อีก ${remaining} รูป (สูงสุด ${maxCount} รูป)`);
      }
      for (const file of pick) {
        void uploadOne(file);
      }
    },
    [maxCount, remaining, uploadOne],
  );

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(ev.target.files);
      // Reset so the same file can be re-selected after a removal
      ev.target.value = "";
    },
    [handleFiles],
  );

  const removeUrl = useCallback(
    (url: string) => {
      onChange(value.filter((u) => u !== url));
    },
    [onChange, value],
  );

  const handleOpenPicker = useCallback(() => {
    if (!canUpload) return;
    fileInputRef.current?.click();
  }, [canUpload]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="sr-only"
        onChange={onInputChange}
        disabled={!canUpload}
        aria-hidden
        tabIndex={-1}
      />

      <div className="flex flex-wrap gap-3">
        {/* Successfully uploaded slots */}
        {value.map((url) => (
          <UploadedSlot
            key={url}
            url={url}
            onRemove={() => removeUrl(url)}
            onOpen={() => setLightboxUrl(url)}
            disabled={disabled}
          />
        ))}

        {/* Transient slots (uploading / error) */}
        {transient.map((slot) => (
          <TransientSlotView
            key={slot.id}
            slot={slot}
            onRemove={() => removeTransient(slot.id)}
            onRetry={() => {
              /* Retry is implemented as delete-then-reupload to avoid double-POSTing
               * on an in-flight request. Users re-pick the file from the picker. */
              removeTransient(slot.id);
              handleOpenPicker();
            }}
          />
        ))}

        {/* Add slot — only shown while under quota */}
        {canUpload && (
          <button
            type="button"
            onClick={handleOpenPicker}
            className={cn(
              "group flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-white text-[color:var(--color-muted)] transition-colors",
              "hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-light-bg)] hover:text-[color:var(--color-primary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
              "border-[color:var(--color-border)]",
            )}
            aria-label={`เพิ่มรูปภาพ (เหลือ ${remaining} / ${maxCount})`}
          >
            <ImagePlus className="size-6" aria-hidden />
            <span className="text-[11px] font-medium">เพิ่มรูป</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[color:var(--color-muted)]">
        <span>
          {value.length} / {maxCount} รูป
        </span>
        <span>รองรับ JPG / PNG / WEBP — ไม่เกิน 5 MB ต่อรูป</span>
      </div>

      {/* Lightbox preview */}
      <Dialog
        open={!!lightboxUrl}
        onOpenChange={(open) => !open && setLightboxUrl(null)}
      >
        <DialogContent className="max-w-3xl p-2 sm:max-w-4xl">
          <DialogTitle className="sr-only">ดูรูปภาพรีวิว</DialogTitle>
          {lightboxUrl && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black">
              {/* Using native <img> here — Cloudinary URLs aren't allowlisted
               * in next.config.ts yet and this is a modal preview, not LCP.
               * Switch to next/image after Backend adds the remote pattern. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxUrl}
                alt="รูปภาพรีวิว"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Slot subcomponents ----------------------------------------------------

interface UploadedSlotProps {
  url: string;
  onRemove: () => void;
  onOpen: () => void;
  disabled?: boolean;
}

function UploadedSlot({ url, onRemove, onOpen, disabled }: UploadedSlotProps) {
  return (
    <div
      className={cn(
        "group relative size-24 shrink-0 overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-light-bg)]",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="ดูรูปขนาดเต็ม"
        className="absolute inset-0 block"
      >
        {/* Native <img> — see note in parent component */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="รูปภาพรีวิว"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 className="size-5" />
        </span>
      </button>
      <button
        type="button"
        onClick={(ev) => {
          ev.stopPropagation();
          onRemove();
        }}
        disabled={disabled}
        aria-label="ลบรูปภาพ"
        className={cn(
          "absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white",
          "transition-opacity hover:bg-[color:var(--color-error)] focus-visible:opacity-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        )}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function TransientSlotView({
  slot,
  onRemove,
  onRetry,
}: {
  slot: TransientSlot;
  onRemove: () => void;
  onRetry: () => void;
}) {
  return (
    <div
      className={cn(
        "relative size-24 shrink-0 overflow-hidden rounded-lg border",
        slot.status === "uploading"
          ? "border-[color:var(--color-primary)]/40 bg-[color:var(--color-light-bg)]"
          : "border-[color:var(--color-error)]/60 bg-[color:var(--color-error)]/5",
      )}
      role={slot.status === "error" ? "alert" : undefined}
    >
      {/* Preview */}
      <Image
        src={slot.previewUrl}
        alt="กำลังอัปโหลด"
        fill
        sizes="96px"
        className={cn(
          "object-cover",
          slot.status === "error" && "opacity-40",
        )}
        unoptimized
      />

      {slot.status === "uploading" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/70 text-[color:var(--color-primary)]"
          aria-live="polite"
        >
          <Loader2 className="size-5 animate-spin" />
          <span className="text-[10px] font-medium">กำลังอัปโหลด...</span>
        </div>
      )}

      {slot.status === "error" && (
        <>
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/70 text-[color:var(--color-error)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-error)]",
            )}
            aria-label={`ลองใหม่: ${slot.errorMessage ?? "อัปโหลดล้มเหลว"}`}
          >
            <AlertCircle className="size-5" />
            <span className="px-1 text-center text-[10px] font-medium leading-tight">
              {slot.errorMessage ?? "ล้มเหลว"}
            </span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="ปิดการแจ้งเตือน"
            className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[color:var(--color-error)]"
          >
            <X className="size-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

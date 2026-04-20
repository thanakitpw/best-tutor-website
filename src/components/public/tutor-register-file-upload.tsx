"use client";

/**
 * TutorRegisterFileUpload — single-file upload widget with state machine:
 *
 *   idle → uploading → (uploaded | error) → idle (after remove)
 *
 * Talks to `POST /api/upload` with FormData. Two kinds are supported:
 *   - "image" (5 MB max, JPEG/PNG/WebP/GIF) — returns { url } for profile pic
 *   - "document" (10 MB max, PDF/JPEG/PNG) — requires tutorId + category
 *
 * IMPORTANT: `/api/upload` currently requires auth (requireAuth). For a
 * public registration form, the user is not signed in → the endpoint will
 * respond 401. We surface that as a friendly "ส่งเอกสารเพิ่มเติมภายหลัง
 * ทาง LINE" message rather than a scary error, so the form remains usable.
 * Phase 4 will add a public pre-signed upload flow or defer documents to
 * LINE intentionally.
 */

import { useCallback, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; fileName: string }
  | { status: "uploaded"; url: string; fileName: string }
  | { status: "error"; message: string };

export type UploadKind = "image" | "document";

interface TutorRegisterFileUploadProps {
  label: string;
  kind: UploadKind;
  /** Accept attribute — informs the browser file picker. */
  accept: string;
  /** Max bytes (for client-side pre-check). */
  maxBytes: number;
  /** Cloudinary folder (image only). */
  folder?: "tutors" | "tutors/profiles" | "articles" | "reviews" | "courses" | "site";
  /** Document category (document only). */
  documentCategory?:
    | "tutor-resume"
    | "tutor-id-card"
    | "tutor-credentials";
  /** Tutor id used for document uploads. Applications-in-flight don't have
   *  one yet, so document uploads from this form will fail with the friendly
   *  fallback — that's intentional. */
  tutorId?: string;
  state: UploadState;
  onStateChange: (next: UploadState) => void;
  helperText?: string;
  id?: string;
}

export function TutorRegisterFileUpload({
  label,
  kind,
  accept,
  maxBytes,
  folder,
  documentCategory,
  tutorId,
  state,
  onStateChange,
  helperText,
  id,
}: TutorRegisterFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      // Client-side pre-checks so the user gets instant feedback
      if (file.size > maxBytes) {
        const mb = (maxBytes / 1024 / 1024).toFixed(0);
        onStateChange({
          status: "error",
          message: `ไฟล์ใหญ่เกินขีดจำกัด (สูงสุด ${mb} MB)`,
        });
        return;
      }

      onStateChange({ status: "uploading", fileName: file.name });

      try {
        const form = new FormData();
        form.append("file", file);
        form.append("kind", kind);
        if (kind === "image") {
          form.append("folder", folder ?? "tutors/profiles");
        } else {
          // Document uploads require a tutorId. Public form doesn't have one
          // yet — we still attempt, but the API will 400/401 which we catch.
          form.append("tutorId", tutorId ?? "pending");
          form.append("category", documentCategory ?? "tutor-credentials");
        }

        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        if (res.status === 401 || res.status === 403) {
          onStateChange({
            status: "error",
            message:
              "ระบบอัปโหลดยังไม่เปิดให้สาธารณะ — ส่งเอกสารทาง LINE หลังทีมติดต่อกลับได้",
          });
          return;
        }

        let body: unknown = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }

        if (!res.ok) {
          const message =
            (body as { error?: { message?: string } } | null)?.error?.message ??
            "อัปโหลดไม่สำเร็จ กรุณาลองใหม่";
          onStateChange({ status: "error", message });
          return;
        }

        // Successful response: { ok: true, data: { url, ... } }
        const url =
          (body as { data?: { url?: string; secureUrl?: string } } | null)?.data
            ?.url ??
          (body as { data?: { secureUrl?: string } } | null)?.data?.secureUrl ??
          "";

        if (!url) {
          onStateChange({
            status: "error",
            message: "อัปโหลดสำเร็จแต่ไม่ได้รับ URL กรุณาลองใหม่",
          });
          return;
        }

        onStateChange({ status: "uploaded", url, fileName: file.name });
      } catch (err) {
        console.error("[TutorRegisterFileUpload] upload error:", err);
        onStateChange({
          status: "error",
          message: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ — ลองใหม่หรือส่งผ่าน LINE",
        });
      }
    },
    [kind, folder, documentCategory, tutorId, maxBytes, onStateChange],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      upload(file);
    },
    [upload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      upload(file);
    },
    [upload],
  );

  const remove = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
    onStateChange({ status: "idle" });
  }, [onStateChange]);

  const Icon = kind === "image" ? ImageIcon : FileText;
  const triggerId = id ?? `file-upload-${label}`;

  return (
    <div>
      <label
        htmlFor={triggerId}
        className="mb-2 block text-sm font-semibold text-[color:var(--color-heading)]"
      >
        {label}
      </label>

      {state.status === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={[
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragOver
              ? "border-[color:var(--color-primary)] bg-[color:var(--color-light-bg)]"
              : "border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)]/40",
          ].join(" ")}
        >
          <Icon
            aria-hidden
            className="size-8 text-[color:var(--color-primary)]/60"
          />
          <p className="mt-2 text-sm text-[color:var(--color-body)]">
            ลากไฟล์มาวาง หรือ{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-[color:var(--color-primary)] underline"
            >
              เลือกจากเครื่อง
            </button>
          </p>
          {helperText && (
            <p className="mt-1 text-xs text-[color:var(--color-muted)]">
              {helperText}
            </p>
          )}
          <input
            id={triggerId}
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onChange}
            className="sr-only"
          />
        </div>
      )}

      {state.status === "uploading" && (
        <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
          <Loader2 className="size-5 animate-spin text-[color:var(--color-primary)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[color:var(--color-body)]">
              {state.fileName}
            </p>
            <p className="text-xs text-[color:var(--color-muted)]">
              กำลังอัปโหลด...
            </p>
          </div>
        </div>
      )}

      {state.status === "uploaded" && (
        <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-success)]/40 bg-[color:var(--color-success)]/10 p-4">
          <CheckCircle2 className="size-5 text-[color:var(--color-success)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[color:var(--color-heading)]">
              {state.fileName}
            </p>
            <p className="text-xs text-[color:var(--color-success)]">
              อัปโหลดเรียบร้อย
            </p>
          </div>
          <Button
            type="button"
            onClick={remove}
            variant="ghost"
            size="sm"
            aria-label="ลบไฟล์"
            className="text-[color:var(--color-muted)] hover:text-[color:var(--color-error)]"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--color-error)]/40 bg-[color:var(--color-error)]/5 p-4">
          <p
            className="text-sm text-[color:var(--color-error)]"
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
            >
              <Upload className="size-4" />
              ลองอีกครั้ง
            </Button>
            <Button
              type="button"
              onClick={remove}
              variant="ghost"
              size="sm"
              className="text-[color:var(--color-muted)]"
            >
              ยกเลิก
            </Button>
          </div>
          <input
            id={triggerId}
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onChange}
            className="sr-only"
          />
        </div>
      )}
    </div>
  );
}

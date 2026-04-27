/**
 * POST /api/admin/upload/image
 *
 * Multipart image upload for the admin CMS. The browser is expected to have
 * already compressed the image (see ImageUpload component) — this route just
 * gatekeeps size/MIME and forwards the bytes to Cloudinary.
 *
 * Body: multipart/form-data
 *   file: File (required, image/*)
 *   folder: string (optional, defaults to "tutors/profiles")
 *
 * Response: { secureUrl, publicId, width, height, bytes }
 *
 * Limits: 2MB after client-side compression (raw camera photos are usually
 * 3-8MB; client should compress before posting).
 */
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/responses";
import {
  uploadToCloudinary,
  type UploadFolder,
} from "@/lib/cloudinary/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB after compression
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const ALLOWED_FOLDERS: UploadFolder[] = [
  "tutors",
  "tutors/profiles",
  "articles",
  "reviews",
  "courses",
  "site",
];

const folderSchema = z
  .string()
  .optional()
  .transform((v) => v ?? "tutors/profiles")
  .refine(
    (v): v is UploadFolder => ALLOWED_FOLDERS.includes(v as UploadFolder),
    "folder ไม่ถูกต้อง",
  );

export type UploadImageResponse = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail(401, "กรุณาเข้าสู่ระบบก่อน");

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return fail(415, "ต้องส่งไฟล์เป็น multipart/form-data");
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return fail(400, "ไม่พบไฟล์");
    if (file.size === 0) return fail(400, "ไฟล์ว่าง");
    if (file.size > MAX_BYTES) {
      return fail(
        413,
        `ไฟล์ใหญ่เกิน ${(MAX_BYTES / 1024 / 1024).toFixed(0)}MB หลังย่อขนาดแล้ว`,
      );
    }
    if (
      !ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])
    ) {
      return fail(
        415,
        `รองรับเฉพาะ ${ALLOWED_MIME.map((m) => m.replace("image/", "")).join(", ")}`,
      );
    }

    const folderInput = formData.get("folder");
    const folderResult = folderSchema.safeParse(
      typeof folderInput === "string" ? folderInput : undefined,
    );
    if (!folderResult.success) return fail(400, "folder ไม่ถูกต้อง");

    // --- Forward to Cloudinary ----------------------------------------------
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, {
      folder: folderResult.data,
    });

    const response: UploadImageResponse = {
      secureUrl: result.secureUrl,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
    return ok(response);
  } catch (error) {
    console.error("[POST /api/admin/upload/image] failed:", error);
    const message =
      error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ";
    return fail(500, message);
  }
}

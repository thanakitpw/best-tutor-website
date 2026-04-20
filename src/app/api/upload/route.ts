import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  requireAuth,
  isAuthError,
} from "@/lib/supabase/auth-helpers";
import { uploadToCloudinary, type UploadFolder } from "@/lib/cloudinary";
import { uploadDocument, type DocumentCategory } from "@/lib/supabase/storage";

export const runtime = "nodejs";
// Do not cache file uploads.
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

const UPLOAD_FOLDERS: readonly UploadFolder[] = [
  "tutors",
  "tutors/profiles",
  "articles",
  "reviews",
  "courses",
  "site",
];

const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  "tutor-resume",
  "tutor-id-card",
  "tutor-credentials",
];

const imageFormSchema = z.object({
  kind: z.literal("image"),
  folder: z.enum(UPLOAD_FOLDERS as unknown as [UploadFolder, ...UploadFolder[]]),
  publicId: z.string().trim().min(1).max(128).optional(),
});

const documentFormSchema = z.object({
  kind: z.literal("document"),
  tutorId: z.string().min(1, "ต้องระบุ tutorId"),
  category: z.enum(
    DOCUMENT_CATEGORIES as unknown as [DocumentCategory, ...DocumentCategory[]],
  ),
});

const formSchema = z.discriminatedUnion("kind", [
  imageFormSchema,
  documentFormSchema,
]);

/**
 * POST /api/upload
 *
 * Multipart form upload. Required fields:
 *   - `file`    — the binary blob
 *   - `kind`    — "image" | "document"
 *
 * Image kind extra fields: `folder`, (optional) `publicId`
 * Document kind extra fields: `tutorId`, `category`
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError(400, "ไม่พบไฟล์แนบในคำขอ (field ชื่อ 'file')");
    }

    const raw = Object.fromEntries(
      Array.from(form.entries()).filter(([key]) => key !== "file"),
    );
    const parsed = formSchema.safeParse(raw);
    if (!parsed.success) {
      return jsonError(
        400,
        "ข้อมูลคำขอไม่ถูกต้อง",
        parsed.error.flatten().fieldErrors,
      );
    }

    if (parsed.data.kind === "image") {
      return await handleImageUpload(file, parsed.data);
    }
    return await handleDocumentUpload(file, parsed.data);
  } catch (error) {
    if (isAuthError(error)) {
      return jsonError(error.code === "UNAUTHENTICATED" ? 401 : 403, error.message);
    }
    console.error("[POST /api/upload] failed:", error);
    return jsonError(500, "อัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง");
  }
}

async function handleImageUpload(
  file: File,
  input: z.infer<typeof imageFormSchema>,
) {
  if (!IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])) {
    return jsonError(415, `ประเภทไฟล์ไม่รองรับ (${file.type || "unknown"})`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return jsonError(413, "ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5 MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, {
    folder: input.folder,
    publicId: input.publicId,
  });

  return NextResponse.json({ ok: true, data: result }, { status: 201 });
}

async function handleDocumentUpload(
  file: File,
  input: z.infer<typeof documentFormSchema>,
) {
  if (
    !DOCUMENT_MIME_TYPES.includes(
      file.type as (typeof DOCUMENT_MIME_TYPES)[number],
    )
  ) {
    return jsonError(415, `ประเภทเอกสารไม่รองรับ (${file.type || "unknown"})`);
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return jsonError(413, "ไฟล์เอกสารต้องมีขนาดไม่เกิน 10 MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadDocument({
    tutorId: input.tutorId,
    category: input.category,
    filename: file.name,
    buffer,
    contentType: file.type,
  });

  return NextResponse.json({ ok: true, data: result }, { status: 201 });
}

function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { message, details } },
    { status },
  );
}

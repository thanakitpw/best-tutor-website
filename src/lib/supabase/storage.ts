import { createSupabaseServiceRoleClient } from "./server";

/**
 * Document uploads (resume, ID card, credentials) go to Supabase Storage
 * rather than Cloudinary so they stay private by default.
 *
 * IMPORTANT: the `documents` bucket must be created manually in the
 * Supabase dashboard → Storage. Recommended settings:
 *   - Public: OFF
 *   - File size limit: 10 MB
 *   - Allowed MIME types: application/pdf, image/png, image/jpeg
 */

const DOCUMENTS_BUCKET = "documents";

export type DocumentCategory =
  | "tutor-resume"
  | "tutor-id-card"
  | "tutor-credentials";

export type UploadDocumentOptions = {
  tutorId: string;
  category: DocumentCategory;
  /** Original filename (used only to derive extension). */
  filename: string;
  /** File body. */
  buffer: Buffer;
  /** MIME type (validated upstream). */
  contentType: string;
};

export type UploadDocumentResult = {
  bucket: string;
  path: string;
  size: number;
};

/**
 * Upload a document to the private `documents` bucket. Path convention:
 *   tutors/<tutorId>/<category>/<timestamp>-<safeFilename>
 */
export async function uploadDocument(
  options: UploadDocumentOptions,
): Promise<UploadDocumentResult> {
  const supabase = createSupabaseServiceRoleClient();
  const safeName = options.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `tutors/${options.tutorId}/${options.category}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, options.buffer, {
      contentType: options.contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`อัปโหลดเอกสารล้มเหลว: ${error.message}`);
  }

  return {
    bucket: DOCUMENTS_BUCKET,
    path,
    size: options.buffer.byteLength,
  };
}

/**
 * Generate a short-lived signed URL for an admin to download a private document.
 * @param path — path returned from `uploadDocument`
 * @param expiresInSeconds — default 60s (admin preview), max 3600s
 */
export async function createSignedDocumentUrl(
  path: string,
  expiresInSeconds: number = 60,
): Promise<string> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) {
    throw new Error(`สร้าง signed URL ล้มเหลว: ${error?.message ?? "unknown"}`);
  }
  return data.signedUrl;
}

/**
 * Delete a document from storage.
 */
export async function deleteDocument(path: string): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
  if (error) {
    throw new Error(`ลบเอกสารล้มเหลว: ${error.message}`);
  }
}

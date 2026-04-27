/**
 * PATCH /api/admin/tutors/[id]
 *
 * Update a tutor's administrative fields: status, isPopular.
 * Requires a valid Supabase session (checked server-side).
 *
 * Body (all fields optional):
 *   {
 *     status?:    "APPROVED" | "REJECTED" | "INACTIVE" | "PENDING"
 *     isPopular?: boolean
 *     note?:      string   (stored as internal note — future field; accepted
 *                          in body for forward-compatibility but not persisted
 *                          until a `notes` column is added to the Tutor model)
 *   }
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail, failValidation } from "@/lib/api/responses";
import type { TutorStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const tutorStatusSchema = z.enum(["APPROVED", "REJECTED", "INACTIVE", "PENDING"]);

const patchBodySchema = z
  .object({
    status: tutorStatusSchema.optional(),
    isPopular: z.boolean().optional(),
    // `note` is accepted for forward-compatibility but not yet stored —
    // the Tutor model does not have a `notes` column. Remove this line
    // once the column is added and persisted below.
    note: z.string().trim().max(2000).optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.isPopular !== undefined,
    { message: "ต้องระบุอย่างน้อยหนึ่ง field: status หรือ isPopular" },
  );

// ---------------------------------------------------------------------------
// Response type
// ---------------------------------------------------------------------------

export type AdminPatchTutorResponse = {
  id: string;
  slug: string;
  status: TutorStatus;
  isPopular: boolean;
};

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // --- Auth check -----------------------------------------------------------
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return fail(401, "กรุณาเข้าสู่ระบบก่อน");
    }

    // --- Resolve dynamic segment ---------------------------------------------
    const { id } = await params;
    if (!id) {
      return fail(400, "ไม่พบ id ของติวเตอร์");
    }

    // --- Parse + validate body ------------------------------------------------
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return fail(400, "รูปแบบ JSON ไม่ถูกต้อง");
    }

    const parsed = patchBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return failValidation(parsed.error, "ข้อมูลที่ส่งมาไม่ถูกต้อง");
    }
    const { status, isPopular } = parsed.data;

    // --- Check tutor exists ---------------------------------------------------
    const existing = await prisma.tutor.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return fail(404, "ไม่พบติวเตอร์ที่ระบุ");
    }

    // --- Build update payload -------------------------------------------------
    const updateData: { status?: TutorStatus; isPopular?: boolean } = {};
    if (status !== undefined) updateData.status = status;
    if (isPopular !== undefined) updateData.isPopular = isPopular;

    // --- Persist ---------------------------------------------------------------
    const updated = await prisma.tutor.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        status: true,
        isPopular: true,
      },
    });

    return ok<AdminPatchTutorResponse>(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/tutors/[id]] failed:", error);
    return fail(500, "ไม่สามารถอัปเดตข้อมูลติวเตอร์ได้");
  }
}

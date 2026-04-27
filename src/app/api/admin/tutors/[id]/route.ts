/**
 * /api/admin/tutors/[id]
 *
 * GET    — fetch a single tutor for the admin edit form
 * PATCH  — update administrative + profile fields
 * DELETE — delete a tutor (cascades to tutorSubjects + reviews per schema)
 *
 * All handlers require a valid Supabase session (checked server-side).
 */
import { z } from "zod";
import { Prisma } from "@prisma/client";
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
    // Administrative fields (existing)
    status: tutorStatusSchema.optional(),
    isPopular: z.boolean().optional(),
    // `note` is accepted for forward-compatibility but not yet stored —
    // the Tutor model does not have a `notes` column. Remove this line
    // once the column is added and persisted below.
    note: z.string().trim().max(2000).optional(),

    // Profile fields (new — match createTutorSchema in ../route.ts)
    nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50).optional(),
    firstName: z.string().trim().min(1, "กรุณากรอกชื่อจริง").max(100).optional(),
    lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100).optional(),
    profileImageUrl: z
      .string()
      .trim()
      .url("URL รูปไม่ถูกต้อง")
      .or(z.literal(""))
      .optional(),
    subjectsTaught: z
      .string()
      .trim()
      .min(1, "กรุณากรอกวิชาที่สอน")
      .max(500)
      .optional(),
    address: z.string().trim().min(1, "กรุณากรอกจังหวัด").max(200).optional(),
    education: z
      .string()
      .trim()
      .min(1, "กรุณากรอกการศึกษา")
      .max(500)
      .optional(),
    teachingStyle: z.string().trim().max(1000).optional(),
    teachingExperienceYears: z.number().int().min(0).max(80).optional(),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.isPopular !== undefined ||
      data.nickname !== undefined ||
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.profileImageUrl !== undefined ||
      data.subjectsTaught !== undefined ||
      data.address !== undefined ||
      data.education !== undefined ||
      data.teachingStyle !== undefined ||
      data.teachingExperienceYears !== undefined,
    { message: "ต้องระบุอย่างน้อยหนึ่ง field ที่ต้องการอัปเดต" },
  );

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export type AdminPatchTutorResponse = {
  id: string;
  slug: string;
  status: TutorStatus;
  isPopular: boolean;
};

export type AdminGetTutorResponse = {
  id: string;
  slug: string;
  nickname: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  subjectsTaught: string | null;
  address: string | null;
  education: string | null;
  teachingStyle: string | null;
  teachingExperienceYears: number;
  status: TutorStatus;
  isPopular: boolean;
  createdAt: string; // ISO string
};

export type AdminDeleteTutorResponse = {
  id: string;
};

// ---------------------------------------------------------------------------
// GET /api/admin/tutors/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
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

    // --- Query DB -------------------------------------------------------------
    const tutor = await prisma.tutor.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        nickname: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        subjectsTaught: true,
        address: true,
        education: true,
        teachingStyle: true,
        teachingExperienceYears: true,
        status: true,
        isPopular: true,
        createdAt: true,
      },
    });

    if (!tutor) {
      return fail(404, "ไม่พบติวเตอร์ที่ระบุ");
    }

    const response: AdminGetTutorResponse = {
      ...tutor,
      createdAt: tutor.createdAt.toISOString(),
    };

    return ok<AdminGetTutorResponse>(response);
  } catch (error) {
    console.error("[GET /api/admin/tutors/[id]] failed:", error);
    return fail(500, "ไม่สามารถโหลดข้อมูลติวเตอร์ได้");
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/tutors/[id]
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
    const {
      status,
      isPopular,
      nickname,
      firstName,
      lastName,
      profileImageUrl,
      subjectsTaught,
      address,
      education,
      teachingStyle,
      teachingExperienceYears,
    } = parsed.data;

    // --- Check tutor exists ---------------------------------------------------
    const existing = await prisma.tutor.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return fail(404, "ไม่พบติวเตอร์ที่ระบุ");
    }

    // --- Build update payload -------------------------------------------------
    const updateData: Prisma.TutorUpdateInput = {};
    if (status !== undefined) updateData.status = status;
    if (isPopular !== undefined) updateData.isPopular = isPopular;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (profileImageUrl !== undefined) {
      // Empty string → null (clears the image)
      updateData.profileImageUrl = profileImageUrl === "" ? null : profileImageUrl;
    }
    if (subjectsTaught !== undefined) updateData.subjectsTaught = subjectsTaught;
    if (address !== undefined) updateData.address = address;
    if (education !== undefined) updateData.education = education;
    if (teachingStyle !== undefined) updateData.teachingStyle = teachingStyle;
    if (teachingExperienceYears !== undefined) {
      updateData.teachingExperienceYears = teachingExperienceYears;
    }

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

// ---------------------------------------------------------------------------
// DELETE /api/admin/tutors/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: Request,
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

    // --- Check tutor exists ---------------------------------------------------
    const existing = await prisma.tutor.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return fail(404, "ไม่พบติวเตอร์ที่ระบุ");
    }

    // --- Delete (Prisma cascades tutorSubjects + reviews per schema) ----------
    await prisma.tutor.delete({ where: { id } });

    return ok<AdminDeleteTutorResponse>({ id });
  } catch (error) {
    console.error("[DELETE /api/admin/tutors/[id]] failed:", error);
    return fail(500, "ไม่สามารถลบติวเตอร์ได้");
  }
}

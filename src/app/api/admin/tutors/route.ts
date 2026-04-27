/**
 * GET /api/admin/tutors
 *
 * Admin-only paginated tutor list with status filtering and search.
 * Requires a valid Supabase session (checked server-side).
 *
 * Query params:
 *   status   PENDING | APPROVED | REJECTED | INACTIVE | all  (default: all)
 *   page     int ≥ 1                                          (default: 1)
 *   limit    int 1–100                                        (default: 20)
 *   q        search string — matched against name + email
 */
import { z } from "zod";
import { Prisma, TutorStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail, failValidation } from "@/lib/api/responses";
import { buildPaginated } from "@/lib/api/pagination";
import { buildSlug, ensureUniqueSlug } from "@/lib/utils/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const statusValues = ["PENDING", "APPROVED", "REJECTED", "INACTIVE", "all"] as const;

const querySchema = z.object({
  status: z.enum(statusValues).default("all"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(200).optional(),
});

export type AdminGetTutorsQuery = z.infer<typeof querySchema>;

// ---------------------------------------------------------------------------
// Response type
// ---------------------------------------------------------------------------

export type AdminTutorListItem = {
  id: string;
  slug: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  subjectsTaught: string | null;
  address: string | null;
  status: TutorStatus;
  isPopular: boolean;
  teachingExperienceYears: number;
  createdAt: string; // ISO string
};

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    // --- Auth check -----------------------------------------------------------
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return fail(401, "กรุณาเข้าสู่ระบบก่อน");
    }

    // --- Parse + validate query params ----------------------------------------
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(
      Object.fromEntries(url.searchParams.entries()),
    );
    if (!parsed.success) {
      return failValidation(parsed.error, "พารามิเตอร์ค้นหาไม่ถูกต้อง");
    }
    const { status, page, limit, q } = parsed.data;
    const skip = (page - 1) * limit;

    // --- Build WHERE clause ---------------------------------------------------
    const where: Prisma.TutorWhereInput = {};

    if (status !== "all") {
      where.status = status as TutorStatus;
    }

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { nickname: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    // --- Query DB -------------------------------------------------------------
    const [rows, total] = await Promise.all([
      prisma.tutor.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          nickname: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          subjectsTaught: true,
          address: true,
          status: true,
          isPopular: true,
          teachingExperienceYears: true,
          createdAt: true,
        },
      }),
      prisma.tutor.count({ where }),
    ]);

    const items: AdminTutorListItem[] = rows.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));

    return ok(buildPaginated(items, total, { page, limit }));
  } catch (error) {
    console.error("[GET /api/admin/tutors] failed:", error);
    return fail(500, "ไม่สามารถโหลดรายชื่อติวเตอร์ได้");
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/tutors — admin creates tutor directly (status APPROVED)
// ---------------------------------------------------------------------------

const createTutorSchema = z.object({
  nickname: z.string().trim().min(1, "กรุณากรอกชื่อเล่น").max(50),
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อจริง").max(100),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100),
  profileImageUrl: z.string().trim().url("URL รูปไม่ถูกต้อง").optional().or(z.literal("")),
  subjectSlugs: z
    .array(z.string())
    .min(1, "กรุณาเลือกวิชาที่สอนอย่างน้อย 1 วิชา"),
  address: z.string().trim().min(1, "กรุณากรอกจังหวัด").max(200),
  education: z.string().trim().min(1, "กรุณากรอกการศึกษา").max(500),
  teachingStyle: z.string().trim().max(1000).optional(),
  teachingExperienceYears: z.coerce.number().int().min(0).max(80).default(0),
});

export type AdminCreateTutorInput = z.infer<typeof createTutorSchema>;
export type AdminCreateTutorResponse = { id: string; slug: string };

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail(401, "กรุณาเข้าสู่ระบบก่อน");

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return fail(415, "Content-Type ต้องเป็น application/json");

    let raw: unknown;
    try { raw = await request.json(); } catch { return fail(400, "JSON body อ่านไม่ออก"); }

    const parsed = createTutorSchema.safeParse(raw);
    if (!parsed.success) return failValidation(parsed.error, "ข้อมูลไม่ถูกต้อง");
    const input = parsed.data;

    // --- Resolve subject slugs → subject rows ---------------------------------
    const resolvedSubjects = await prisma.subject.findMany({
      where: { slug: { in: input.subjectSlugs } },
      select: { id: true, slug: true, name: true },
    });
    // Surface unknown slugs as a 400 — silently dropping them produced tutors
    // with empty `tutor_subjects` rows that never showed on /subject/* pages.
    const knownSlugs = new Set(resolvedSubjects.map((s) => s.slug));
    const unknownSlugs = input.subjectSlugs.filter((s) => !knownSlugs.has(s));
    if (unknownSlugs.length > 0) {
      return fail(
        400,
        `ไม่รู้จัก subject slug: ${unknownSlugs.join(", ")}`,
      );
    }
    const subjectsTaught = resolvedSubjects.map((s) => s.name).join(", ");

    const baseSlug = buildSlug([input.nickname, input.firstName, input.lastName], input.nickname);
    const slug = await ensureUniqueSlug(baseSlug, async (c) => {
      const existing = await prisma.tutor.findUnique({ where: { slug: c }, select: { id: true } });
      return Boolean(existing);
    });

    const tutor = await prisma.tutor.create({
      data: {
        slug,
        nickname: input.nickname,
        firstName: input.firstName,
        lastName: input.lastName,
        profileImageUrl: input.profileImageUrl || null,
        subjectsTaught,
        address: input.address,
        education: input.education,
        teachingStyle: input.teachingStyle ?? null,
        teachingExperienceYears: input.teachingExperienceYears,
        status: "APPROVED",
        isPopular: false,
      },
      select: { id: true, slug: true },
    });

    // --- Write junction rows --------------------------------------------------
    // subjectSlugs is required (min 1), and unknown slugs already returned 400
    // above, so resolvedSubjects is guaranteed non-empty here.
    await prisma.tutorSubject.createMany({
      data: resolvedSubjects.map((s) => ({
        tutorId: tutor.id,
        subjectId: s.id,
      })),
    });

    const response: AdminCreateTutorResponse = { id: tutor.id, slug: tutor.slug };
    return ok(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/tutors] failed:", error);
    return fail(500, "บันทึกข้อมูลติวเตอร์ไม่สำเร็จ");
  }
}

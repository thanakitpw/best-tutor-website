/**
 * POST /api/tutor-applications
 *
 * Public endpoint for `/tutor-register` form. Creates a Tutor row in PENDING
 * status — admin approves/rejects in the back office.
 *
 * - Slug is generated from nickname/firstName/lastName via Thai transliteration.
 *   If collisions exist, we suffix with `-2`, `-3`, ... or fall back to random.
 * - Line notification fires best-effort.
 * - `subjectsTaught` is stored as a free-text summary for now; the relational
 *   TutorSubject records are populated by admin when approving (Phase 4).
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewTutorRegistration } from "@/lib/line/notify";
import { ok, fail, failValidation } from "@/lib/api/responses";
import { buildSlug, ensureUniqueSlug } from "@/lib/utils/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHONE_REGEX = /^[0-9+\-() ]{9,20}$/;

const documentsSchema = z
  .object({
    resume: z.string().url().optional(),
    idCard: z.string().url().optional(),
    credentials: z.array(z.string().url()).max(10).default([]),
  })
  .optional();

const createTutorApplicationSchema = z.object({
  nickname: z.string().trim().min(1).max(50),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(PHONE_REGEX, "เบอร์โทรไม่ถูกต้อง"),
  lineId: z.string().trim().min(1).max(100),
  education: z.string().trim().min(10).max(500),
  occupation: z.string().trim().max(200).optional(),
  teachingExperienceYears: z.number().int().min(0).max(50),
  teachingStyle: z.string().trim().max(1000).optional(),
  subjectsTaught: z.string().trim().min(1).max(500),
  address: z.string().trim().min(1).max(500),
  vehicleType: z.string().trim().max(100).optional(),
  documents: documentsSchema,
});

export type CreateTutorApplicationInput = z.infer<
  typeof createTutorApplicationSchema
>;

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTutorApplicationResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
});
export type CreateTutorApplicationResponse = z.infer<
  typeof createTutorApplicationResponseSchema
>;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return fail(415, "Content-Type ต้องเป็น application/json");
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return fail(400, "JSON body อ่านไม่ออก");
    }

    const parsed = createTutorApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      return failValidation(parsed.error, "ข้อมูลสมัครไม่ถูกต้อง");
    }
    const input = parsed.data;

    // Build a slug candidate from nickname + real name, then guarantee unique.
    const baseSlug = buildSlug(
      [input.nickname, input.firstName, input.lastName],
      input.nickname,
    );
    const slug = await ensureUniqueSlug(baseSlug, async (candidate) => {
      const existing = await prisma.tutor.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(existing);
    });

    const tutor = await prisma.tutor.create({
      data: {
        slug,
        nickname: input.nickname,
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        email: input.email,
        phone: input.phone,
        lineId: input.lineId,
        education: input.education,
        occupation: input.occupation,
        teachingExperienceYears: input.teachingExperienceYears,
        teachingStyle: input.teachingStyle,
        subjectsTaught: input.subjectsTaught,
        address: input.address,
        vehicleType: input.vehicleType,
        documents: input.documents
          ? {
              resumeUrl: input.documents.resume ?? null,
              idCardUrl: input.documents.idCard ?? null,
              credentialsUrls: input.documents.credentials ?? [],
            }
          : undefined,
        status: "PENDING",
        isPopular: false,
      },
      select: { id: true, slug: true },
    });

    notifyNewTutorRegistration({
      nickname: input.nickname,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      subjectsTaught: input.subjectsTaught,
    }).catch((err) => {
      console.error(
        "[POST /api/tutor-applications] line notify failed:",
        err,
      );
    });

    const response: CreateTutorApplicationResponse = {
      id: tutor.id,
      slug: tutor.slug,
    };
    return ok(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tutor-applications] failed:", error);
    return fail(500, "บันทึกข้อมูลสมัครไม่สำเร็จ กรุณาลองใหม่");
  }
}

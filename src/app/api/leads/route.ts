/**
 * POST /api/leads
 *
 * Public lead-capture endpoint for the "หาครูสอนพิเศษ" (find-tutor) form.
 * No auth — this IS the front door of the funnel. Abuse-mitigation:
 *   - Zod schema constrains every field (length, shape)
 *   - Soft rate-limit: >=3 submissions from same phone in 5 min → 429
 *   - Line notification is fire-and-forget (.catch so it never blocks UX)
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewLead } from "@/lib/line/notify";
import { ok, fail, failValidation } from "@/lib/api/responses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allow intl + spaces + separators, 9–20 chars. Loose on purpose so Thai users
// entering "081-234-5678" and "+66 81 234 5678" both pass.
const PHONE_REGEX = /^[0-9+\-() ]{9,20}$/;

const createLeadSchema = z.object({
  subjectCategory: z.string().trim().min(1).max(120),
  subject: z.string().trim().max(120).optional(),
  learningGoal: z.string().trim().max(500).optional(),
  studentAgeGroup: z.string().trim().max(60).optional(),
  province: z.string().trim().max(120).optional(),
  district: z.string().trim().max(120).optional(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().regex(PHONE_REGEX, "เบอร์โทรไม่ถูกต้อง"),
  lineId: z.string().trim().max(100).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createLeadResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
});
export type CreateLeadResponse = z.infer<typeof createLeadResponseSchema>;

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 min
const RATE_LIMIT_MAX_PER_PHONE = 3;

export async function POST(request: Request) {
  try {
    // Guard against non-JSON posts (e.g. form-encoded bots probing)
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

    const parsed = createLeadSchema.safeParse(raw);
    if (!parsed.success) {
      return failValidation(parsed.error, "ข้อมูลในฟอร์มไม่ถูกต้อง");
    }
    const input = parsed.data;

    // --- Soft rate limit: count recent leads from same phone ----------------
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const recent = await prisma.lead.count({
      where: { phone: input.phone, createdAt: { gte: since } },
    });
    if (recent >= RATE_LIMIT_MAX_PER_PHONE) {
      return fail(
        429,
        "ส่งคำขอบ่อยเกินไป กรุณาลองใหม่ในไม่กี่นาที",
      );
    }

    const lead = await prisma.lead.create({
      data: {
        subjectCategory: input.subjectCategory,
        subject: input.subject,
        learningGoal: input.learningGoal,
        studentAgeGroup: input.studentAgeGroup,
        province: input.province,
        district: input.district,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        lineId: input.lineId,
        status: "NEW",
      },
      select: { id: true, createdAt: true },
    });

    // Fire-and-forget — user sees success fast, Line delivery is best-effort.
    notifyNewLead({
      fullName: input.fullName,
      subjectCategory: input.subjectCategory,
      subject: input.subject ?? null,
      phone: input.phone,
      province: input.province ?? null,
    }).catch((err) => {
      console.error("[POST /api/leads] line notify failed:", err);
    });

    const response: CreateLeadResponse = {
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
    };
    return ok(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/leads] failed:", error);
    return fail(500, "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
  }
}

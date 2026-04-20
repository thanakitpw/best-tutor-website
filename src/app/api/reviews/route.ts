/**
 * POST /api/reviews
 *
 * Public review submission for `/review` page. Reviewers may reference a
 * tutor by either `tutorId` or `tutorSlug` (slug is what the public URL
 * carries). Created reviews start hidden + unverified — admin must approve
 * before they surface on the tutor profile.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewReview } from "@/lib/line/notify";
import { ok, fail, failValidation } from "@/lib/api/responses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createReviewSchema = z
  .object({
    tutorId: z.string().trim().min(1).optional(),
    tutorSlug: z.string().trim().min(1).max(160).optional(),
    reviewerName: z.string().trim().min(2).max(100),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional(),
    images: z.array(z.string().url()).max(5).default([]),
  })
  .refine((v) => Boolean(v.tutorId) || Boolean(v.tutorSlug), {
    message: "ต้องระบุ tutorId หรือ tutorSlug",
    path: ["tutorId"],
  });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// Schema declared for type inference (response contract). Not runtime-used.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createReviewResponseSchema = z.object({ id: z.string() });
export type CreateReviewResponse = z.infer<typeof createReviewResponseSchema>;

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

    const parsed = createReviewSchema.safeParse(raw);
    if (!parsed.success) {
      return failValidation(parsed.error, "ข้อมูลรีวิวไม่ถูกต้อง");
    }
    const input = parsed.data;

    // Resolve tutor (id takes precedence, then slug)
    const tutor = await prisma.tutor.findFirst({
      where: input.tutorId
        ? { id: input.tutorId }
        : { slug: input.tutorSlug! },
      select: { id: true, nickname: true, firstName: true, lastName: true, status: true },
    });
    if (!tutor || tutor.status !== "APPROVED") {
      return fail(404, "ไม่พบติวเตอร์ที่ต้องการรีวิว");
    }

    const review = await prisma.review.create({
      data: {
        tutorId: tutor.id,
        reviewerName: input.reviewerName,
        rating: input.rating,
        comment: input.comment,
        images: input.images,
        isVerified: false,
        isVisible: false, // hidden until admin approves
      },
      select: { id: true },
    });

    notifyNewReview({
      tutorName: `${tutor.nickname} (${tutor.firstName} ${tutor.lastName})`,
      reviewerName: input.reviewerName,
      rating: input.rating,
      comment: input.comment ?? null,
    }).catch((err) => {
      console.error("[POST /api/reviews] line notify failed:", err);
    });

    const response: CreateReviewResponse = { id: review.id };
    return ok(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews] failed:", error);
    return fail(500, "ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
  }
}

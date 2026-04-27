// Mock Shopee-style reviews for `/tutor/[slug]`. These are used while the
// Prisma DB is still empty (Phase 2/3); `/api/tutors/[slug]` will replace them
// with real data in Phase 8. Shapes intentionally stay a strict SUBSET of
// `TutorReviewItem` from `/api/tutors/[slug]/route.ts` + the Review model so
// components don't need to change later.

import type { MockTutor } from "@/components/public/mock-data";

export interface MockReview {
  id: string;
  /** Slug of the tutor the review belongs to — used to filter per profile. */
  tutorSlug: string;
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  /** Absolute URLs (Cloudinary sample images). Empty = no photos. */
  images: string[];
  isVerified: boolean;
  /** `null` = admin hasn't replied. */
  adminReply: string | null;
  createdAt: Date;
}

export interface MockRatingStats {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

// ---- Image placeholders ----------------------------------------------------
// Cloudinary's public demo sample images — no auth required and served via the
// `res.cloudinary.com` allowlist already configured in `next.config.ts`.
const SAMPLE_IMG = (id: string) =>
  `https://res.cloudinary.com/demo/image/upload/w_600,h_600,c_fill,q_auto,f_auto/${id}.jpg`;
const IMG_BOOK = SAMPLE_IMG("samples/landscapes/architecture-signs");
const IMG_NOTE = SAMPLE_IMG("samples/food/spices");
const IMG_DESK = SAMPLE_IMG("samples/landscapes/nature-mountains");

const ADMIN_REPLY_STANDARD =
  "ขอบคุณมากสำหรับรีวิวดี ๆ ครับ ทีม Best Tutor Thailand ขอขอบคุณที่ไว้วางใจให้เราช่วยจับคู่ติวเตอร์ให้ ถ้าต้องการเรียนต่อหรือแนะนำเพื่อน ติดต่อกลับได้ตลอดเลยนะครับ";
const ADMIN_REPLY_SHORT =
  "ขอบคุณสำหรับรีวิวครับ ทีมงานดีใจที่น้องได้ครูที่เหมาะกับตัวเอง";

// ---- Reviews ---------------------------------------------------------------
// 20 reviews spread across 6 mock tutors, mostly 5 stars (realistic distribution).
// Dates spread over ~6 months, newest first by design so slice(-k) still works.
export const MOCK_REVIEWS: MockReview[] = [
  // ครูวาวา — 5 reviews
  {
    id: "r1",
    tutorSlug: "kru-wawa-panisa",
    reviewerName: "คุณแม่ชมพู่",
    rating: 5,
    comment:
      "ลูกเรียนกับครูวาวา 4 เดือน คะแนน IELTS ขึ้นจาก 5.5 เป็น 7.0 ครูใจเย็น อธิบายละเอียดมาก มีแบบฝึกหัดให้ทำทุกคาบ",
    images: [IMG_NOTE, IMG_BOOK],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-04-12"),
  },
  {
    id: "r2",
    tutorSlug: "kru-wawa-panisa",
    reviewerName: "น้องพลอย",
    rating: 5,
    comment:
      "ครูสอนสนุก เป็นกันเอง ไม่กดดัน สอนเทคนิคทำข้อสอบเยอะมาก หนูได้ A เทอมนี้ค่ะ ขอบคุณครูวาวาเลยค่ะ",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-03-28"),
  },
  {
    id: "r3",
    tutorSlug: "kru-wawa-panisa",
    reviewerName: "คุณพ่อวิชัย",
    rating: 5,
    comment:
      "ครูตรงเวลา เตรียมการสอนดี มีรายงานความคืบหน้าให้ทุกเดือน เหมาะกับเด็กที่ต้องการเตรียมสอบเข้ามหา'ลัยครับ",
    images: [IMG_BOOK],
    isVerified: true,
    adminReply: ADMIN_REPLY_SHORT,
    createdAt: new Date("2026-02-15"),
  },
  {
    id: "r4",
    tutorSlug: "kru-wawa-panisa",
    reviewerName: "น้องมายด์",
    rating: 4,
    comment:
      "ครูสอนดีมากค่ะ แต่บางทีรู้สึกว่าเนื้อหาเร็วไปหน่อย อาจต้องขอให้ครูทบทวนซ้ำบ้าง โดยรวมคุ้มค่าครับ",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "r5",
    tutorSlug: "kru-wawa-panisa",
    reviewerName: "คุณแม่นิดา",
    rating: 5,
    comment:
      "น้องสนุกทุกคาบ อยากเรียนภาษาอังกฤษทุกวันเลยค่ะ ครูน่ารักมาก",
    images: [IMG_DESK, IMG_BOOK, IMG_NOTE],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2025-12-10"),
  },

  // ครูมิกะ — 3 reviews
  {
    id: "r6",
    tutorSlug: "kru-mika-ratchanee",
    reviewerName: "น้องจูน",
    rating: 5,
    comment:
      "เรียนภาษาจีนกับครูมิกะมาปีกว่า ตอนนี้สอบ HSK 5 ผ่านแล้วค่ะ ครูเก่งและใจดีมาก",
    images: [IMG_NOTE],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-04-05"),
  },
  {
    id: "r7",
    tutorSlug: "kru-mika-ratchanee",
    reviewerName: "คุณพ่อสุรชัย",
    rating: 5,
    comment:
      "ลูกเริ่มจากไม่รู้จักภาษาจีนเลย เรียนกับครูมิกะ 6 เดือน พูดได้คล่องแล้ว ครูจับจุดเด็กเก่งมาก",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-02-28"),
  },
  {
    id: "r8",
    tutorSlug: "kru-mika-ratchanee",
    reviewerName: "น้องเอิร์ธ",
    rating: 4,
    comment:
      "ครูเตรียมเอกสารดีมาก มีแบบฝึกหัดเพิ่มเติมให้ทำที่บ้านทุกสัปดาห์ ข้อเสียคือเวลานัดต้องจองล่วงหน้า แต่ก็เข้าใจเพราะครูคิวเยอะ",
    images: [],
    isVerified: false,
    adminReply: null,
    createdAt: new Date("2026-01-12"),
  },

  // ครูวิว — 4 reviews
  {
    id: "r9",
    tutorSlug: "kru-view-thanakrit",
    reviewerName: "น้องก้อง",
    rating: 5,
    comment:
      "ครูวิวอธิบายฟิสิกส์เข้าใจง่ายมากครับ จากที่ไม่ชอบเลย ตอนนี้ชอบวิชานี้ไปแล้ว คะแนนในห้องติดอันดับต้น ๆ",
    images: [IMG_BOOK, IMG_NOTE],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-04-18"),
  },
  {
    id: "r10",
    tutorSlug: "kru-view-thanakrit",
    reviewerName: "คุณแม่อรุณ",
    rating: 5,
    comment:
      "ครูมีแบบฝึกหัดย้อนหลัง 10 ปี ติวเข้มข้น ลูกติดคณะที่ต้องการตั้งแต่รอบแรกเลยค่ะ แนะนำมาก ๆ",
    images: [IMG_DESK],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-03-22"),
  },
  {
    id: "r11",
    tutorSlug: "kru-view-thanakrit",
    reviewerName: "น้องฟิวส์",
    rating: 5,
    comment:
      "ครูให้การบ้านเยอะมาก แต่ทำเสร็จแล้วเห็นผลจริง คะแนนคณิตขึ้นชัดเจน",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-02-08"),
  },
  {
    id: "r12",
    tutorSlug: "kru-view-thanakrit",
    reviewerName: "คุณแม่ณัฐ",
    rating: 3,
    comment:
      "ครูสอนเก่ง แต่บางทีเด็ก ๆ ตามไม่ทัน อาจต้องปรับจังหวะให้ช้าลงหน่อยสำหรับน้องเล็ก",
    images: [],
    isVerified: true,
    adminReply:
      "ขอบคุณสำหรับฟีดแบ็กครับ ทีมงานได้พูดคุยกับครูวิวแล้ว และจะปรับแผนการสอนให้เหมาะกับน้องมากขึ้นในคาบต่อไปครับ",
    createdAt: new Date("2025-12-18"),
  },

  // ครูแจม — 3 reviews
  {
    id: "r13",
    tutorSlug: "kru-jam-supanida",
    reviewerName: "น้องเบล",
    rating: 5,
    comment:
      "ครูแจมสอนชีววิทยาเหมือนเล่านิทาน เข้าใจง่ายสุด ๆ ติดหมอแล้วค่ะ ขอบคุณมาก",
    images: [IMG_NOTE],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-04-01"),
  },
  {
    id: "r14",
    tutorSlug: "kru-jam-supanida",
    reviewerName: "คุณแม่พิม",
    rating: 5,
    comment:
      "ครูใส่ใจลูกเยอะมาก ส่งข้อความถามความคืบหน้าระหว่างสัปดาห์ด้วย ประทับใจค่ะ",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-02-20"),
  },
  {
    id: "r15",
    tutorSlug: "kru-jam-supanida",
    reviewerName: "น้องพี",
    rating: 4,
    comment:
      "ครูสอนสนุก แต่รู้สึกว่าเวลาเรียน 2 ชม.น้อยไปนิด อยากเรียนมากกว่านี้",
    images: [],
    isVerified: false,
    adminReply: null,
    createdAt: new Date("2026-01-05"),
  },

  // ครูอลิซ — 3 reviews
  {
    id: "r16",
    tutorSlug: "kru-alice-chavalya",
    reviewerName: "น้องออม",
    rating: 5,
    comment:
      "SAT score ขึ้นจาก 1200 เป็น 1480 หลังเรียนกับครูอลิซแค่ 3 เดือน ครูมี strategy ดีมาก",
    images: [IMG_BOOK, IMG_DESK],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-04-15"),
  },
  {
    id: "r17",
    tutorSlug: "kru-alice-chavalya",
    reviewerName: "คุณพ่อธนา",
    rating: 5,
    comment:
      "ครูเตรียมสอบให้ลูกดีมาก มี mock test ให้ทำทุกสัปดาห์ ลูกติดมหาวิทยาลัยในอเมริกาที่อยากไปแล้วค่ะ",
    images: [],
    isVerified: true,
    adminReply: ADMIN_REPLY_SHORT,
    createdAt: new Date("2026-03-10"),
  },
  {
    id: "r18",
    tutorSlug: "kru-alice-chavalya",
    reviewerName: "น้องเกรซ",
    rating: 5,
    comment:
      "ครูน่ารัก สอน grammar เข้าใจง่ายมาก พูดได้คล่องขึ้นเยอะค่ะ",
    images: [IMG_NOTE],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2026-01-28"),
  },

  // ครูเนย — 2 reviews
  {
    id: "r19",
    tutorSlug: "kru-ney-kanyarat",
    reviewerName: "น้องแป้ง",
    rating: 5,
    comment:
      "ครูเนยสอนวรรณคดีไทยได้สนุกมาก ไม่น่าเบื่อเลย เรียนแล้วเข้าใจลึกจนสอบเข้าคณะอักษรศาสตร์ได้",
    images: [],
    isVerified: true,
    adminReply: ADMIN_REPLY_STANDARD,
    createdAt: new Date("2026-03-30"),
  },
  {
    id: "r20",
    tutorSlug: "kru-ney-kanyarat",
    reviewerName: "คุณแม่สมร",
    rating: 4,
    comment:
      "ครูใจดี สอนภาษาไทยได้ดี ลูกเกรดขึ้นจาก C เป็น B+ แล้วค่ะ",
    images: [],
    isVerified: true,
    adminReply: null,
    createdAt: new Date("2025-12-05"),
  },
];

// ---- Helpers ---------------------------------------------------------------

export function getMockReviewsByTutorSlug(tutorSlug: string): MockReview[] {
  return MOCK_REVIEWS.filter((r) => r.tutorSlug === tutorSlug).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

/**
 * Compute rating stats from the mock reviews for a given tutor. Mirrors the
 * `ratingStats` field in `GetTutorBySlugResponse` so components can swap the
 * source later without shape changes.
 */
export function mockRatingStats(tutorSlug: string): MockRatingStats {
  const reviews = getMockReviewsByTutorSlug(tutorSlug);
  const distribution: MockRatingStats["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  for (const r of reviews) {
    distribution[r.rating] += 1;
    sum += r.rating;
  }
  const total = reviews.length;
  const average = total === 0 ? 0 : Math.round((sum / total) * 10) / 10;
  return { average, total, distribution };
}

/**
 * Look up the 3 related tutors sharing at least one subject with the current
 * tutor, excluding the tutor itself. Used for the "ติวเตอร์ท่านอื่น..." row.
 */
export function getRelatedMockTutors(
  current: MockTutor,
  allTutors: readonly MockTutor[],
  limit = 3,
): MockTutor[] {
  const others = allTutors.filter((t) => t.slug !== current.slug);
  const scored = others
    .map((t) => ({
      tutor: t,
      overlap: t.subjects.filter((s) => current.subjects.includes(s)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, limit).map((s) => s.tutor);
}

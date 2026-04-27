// Subject taxonomy + tutor matching used only by /subject/* routes.
// Kept colocated (route-group scoped) so it does not leak into the global
// mock-data module that Frontend teammate does not own to modify.
//
// Shape mirrors the eventual Prisma shape (subject_categories + subjects
// tables) — when the Backend exposes /api/subjects/[slug]/tutors we swap
// the lookups here for TanStack Query calls without touching the UI.

import {
  MOCK_ALL_CATEGORIES,
  type MockSubject,
} from "@/components/public/mock-data";

// Re-export for components that previously imported `ListingTutor` from this module.
export type { ListingTutor } from "@/lib/tutors/public";

// ---- Sub-subjects ----------------------------------------------------------

export interface SubSubject {
  slug: string;
  name: string;
  /** Keywords present in MockTutor.subjects[] that map this sub-subject to
   * tutors. Matching is case-insensitive "includes" so minor copy variants
   * still match (e.g. "IELTS" ⊂ "ภาษาอังกฤษ · IELTS"). */
  tutorMatchTerms: readonly string[];
}

export interface SubjectCategory extends MockSubject {
  /** Long-form description shown on the category hero. */
  description: string;
  /** Target H1 on listing page — SEO-tuned. */
  seoHeadline: string;
  /** Meta description seed (combined with tutor count at render time). */
  seoBlurb: string;
  /** Hand-picked keywords for <meta name="keywords">. */
  seoKeywords: readonly string[];
  /** Sub-subjects. Empty array = category has no further breakdown. */
  subs: readonly SubSubject[];
  /** Terms used to match tutors that teach ANYTHING in this category. */
  tutorMatchTerms: readonly string[];
}

// Single source of truth for /subject/* pages. Order matches the homepage +
// /tutors grid so crumbs stay predictable.
export const SUBJECT_CATEGORIES: readonly SubjectCategory[] = [
  {
    ...pickFromAll("english"),
    name: "ภาษาต่างประเทศ",
    description:
      "เรียนภาษาต่างประเทศตัวต่อตัว ทั้งที่บ้านและออนไลน์ ครอบคลุม ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี พร้อมติวสอบ IELTS, TOEIC, HSK และ TOPIK",
    seoHeadline: "ติวเตอร์ภาษาต่างประเทศ สอนพิเศษตัวต่อตัว",
    seoBlurb:
      "รวมติวเตอร์ภาษาอังกฤษ จีน ญี่ปุ่น เกาหลี คุณภาพสูง สอนพิเศษตัวต่อตัว ที่บ้าน/ออนไลน์ ติวสอบ IELTS TOEIC HSK TOPIK",
    seoKeywords: [
      "ติวเตอร์ภาษาอังกฤษ",
      "ติวเตอร์ภาษาจีน",
      "ติวเตอร์ภาษาญี่ปุ่น",
      "ติวเตอร์ภาษาเกาหลี",
      "เรียนภาษาตัวต่อตัว",
      "ติวสอบ IELTS",
      "ติวสอบ TOEIC",
      "HSK",
      "TOPIK",
    ],
    subs: [
      {
        slug: "english",
        name: "ภาษาอังกฤษ",
        tutorMatchTerms: ["ภาษาอังกฤษ", "English", "IELTS", "TOEIC", "SAT"],
      },
      {
        slug: "chinese",
        name: "ภาษาจีน",
        tutorMatchTerms: ["ภาษาจีน", "Chinese", "HSK"],
      },
      {
        slug: "japanese",
        name: "ภาษาญี่ปุ่น",
        tutorMatchTerms: ["ภาษาญี่ปุ่น", "Japanese", "JLPT"],
      },
      {
        slug: "korean",
        name: "ภาษาเกาหลี",
        tutorMatchTerms: ["ภาษาเกาหลี", "Korean", "TOPIK"],
      },
    ],
    tutorMatchTerms: [
      "ภาษาอังกฤษ",
      "ภาษาจีน",
      "ภาษาญี่ปุ่น",
      "ภาษาเกาหลี",
      "IELTS",
      "TOEIC",
      "HSK",
      "TOPIK",
      "SAT",
    ],
  },
  {
    ...pickFromAll("math"),
    description:
      "ติวคณิตศาสตร์ทุกระดับ ตั้งแต่ประถม มัธยม จนถึงมหาวิทยาลัย พร้อมเทคนิคคิดเร็ว ปูพื้นฐานแน่น ๆ และเตรียมสอบเข้า TGAT TPAT A-Level",
    seoHeadline: "ติวเตอร์คณิตศาสตร์ สอนพิเศษคณิตทุกระดับ",
    seoBlurb:
      "ติวเตอร์คณิตศาสตร์คุณภาพ สอนพิเศษตัวต่อตัว แคลคูลัส สถิติ บัญชี พร้อมเทคนิคคิดเร็วและเตรียมสอบเข้ามหาวิทยาลัย",
    seoKeywords: [
      "ติวเตอร์คณิตศาสตร์",
      "ติวคณิต",
      "ติวแคลคูลัส",
      "ติวสถิติ",
      "ติวบัญชี",
      "คณิตสอบเข้ามหาวิทยาลัย",
      "TGAT คณิต",
    ],
    subs: [
      {
        slug: "general",
        name: "คณิตทั่วไป",
        tutorMatchTerms: ["คณิตศาสตร์", "คณิต", "Math"],
      },
      {
        slug: "calculus",
        name: "แคลคูลัส",
        tutorMatchTerms: ["แคลคูลัส", "Calculus"],
      },
      {
        slug: "statistics",
        name: "สถิติ",
        tutorMatchTerms: ["สถิติ", "Statistics"],
      },
      {
        slug: "accounting",
        name: "บัญชี",
        tutorMatchTerms: ["บัญชี", "Accounting"],
      },
    ],
    tutorMatchTerms: ["คณิตศาสตร์", "คณิต", "แคลคูลัส", "สถิติ", "บัญชี", "Math"],
  },
  {
    ...pickFromAll("science"),
    description:
      "ติวเตอร์วิทยาศาสตร์ครบทุกสาขา ฟิสิกส์ เคมี ชีววิทยา และวิทย์ทั่วไป ปรับพื้นฐานและเตรียมสอบ TCAS TGAT TPAT A-Level",
    seoHeadline: "ติวเตอร์วิทยาศาสตร์ ฟิสิกส์ เคมี ชีววิทยา",
    seoBlurb:
      "ติวเตอร์วิทยาศาสตร์คุณภาพ ฟิสิกส์ เคมี ชีววิทยา พร้อมสรุปเนื้อหาและเทคนิคทำข้อสอบ เตรียมสอบเข้ามหาวิทยาลัย",
    seoKeywords: [
      "ติวเตอร์วิทยาศาสตร์",
      "ติวเตอร์ฟิสิกส์",
      "ติวเตอร์เคมี",
      "ติวเตอร์ชีววิทยา",
      "ติววิทย์",
      "TCAS วิทย์",
    ],
    subs: [
      {
        slug: "physics",
        name: "ฟิสิกส์",
        tutorMatchTerms: ["ฟิสิกส์", "Physics"],
      },
      {
        slug: "chemistry",
        name: "เคมี",
        tutorMatchTerms: ["เคมี", "Chemistry"],
      },
      {
        slug: "biology",
        name: "ชีววิทยา",
        tutorMatchTerms: ["ชีววิทยา", "Biology"],
      },
      {
        slug: "general",
        name: "วิทยาศาสตร์ทั่วไป",
        tutorMatchTerms: ["วิทยาศาสตร์", "Science"],
      },
    ],
    tutorMatchTerms: ["ฟิสิกส์", "เคมี", "ชีววิทยา", "วิทยาศาสตร์"],
  },
  {
    ...pickFromAll("thai"),
    description:
      "ติวเตอร์ภาษาไทย ครูเฉพาะทาง สอนอ่าน เขียน แต่งกลอน ไวยากรณ์ พร้อมเตรียมสอบเข้าโรงเรียนดังและ TGAT ภาษาไทย",
    seoHeadline: "ติวเตอร์ภาษาไทย สอนพิเศษภาษาไทย",
    seoBlurb:
      "รวมติวเตอร์ภาษาไทยคุณภาพ สอนพิเศษตัวต่อตัว อ่าน-เขียน แต่งกลอน ไวยากรณ์ เตรียมสอบเข้า",
    seoKeywords: [
      "ติวเตอร์ภาษาไทย",
      "ติวภาษาไทย",
      "สอนภาษาไทย",
      "ติวสอบเข้าภาษาไทย",
    ],
    subs: [],
    tutorMatchTerms: ["ภาษาไทย", "Thai"],
  },
  {
    ...pickFromAll("social"),
    description:
      "ติวเตอร์สังคมศึกษา ครอบคลุมประวัติศาสตร์ กฎหมาย เศรษฐศาสตร์ ภูมิศาสตร์ และหน้าที่พลเมือง เตรียมสอบเข้ามหาวิทยาลัย",
    seoHeadline: "ติวเตอร์สังคมศึกษา ประวัติศาสตร์ กฎหมาย เศรษฐศาสตร์",
    seoBlurb:
      "ติวเตอร์สังคมศึกษาคุณภาพ ประวัติศาสตร์ กฎหมาย เศรษฐศาสตร์ ภูมิศาสตร์ ติวเข้มเตรียมสอบเข้ามหาวิทยาลัย",
    seoKeywords: [
      "ติวเตอร์สังคม",
      "ติวเตอร์ประวัติศาสตร์",
      "ติวเตอร์กฎหมาย",
      "ติวเตอร์เศรษฐศาสตร์",
      "ติวสอบเข้าสังคม",
    ],
    subs: [
      {
        slug: "law",
        name: "กฎหมาย",
        tutorMatchTerms: ["กฎหมาย", "Law"],
      },
      {
        slug: "history",
        name: "ประวัติศาสตร์",
        tutorMatchTerms: ["ประวัติศาสตร์", "History"],
      },
      {
        slug: "economics",
        name: "เศรษฐศาสตร์",
        tutorMatchTerms: ["เศรษฐศาสตร์", "Economics"],
      },
    ],
    tutorMatchTerms: [
      "สังคมศึกษา",
      "สังคม",
      "ประวัติศาสตร์",
      "กฎหมาย",
      "เศรษฐศาสตร์",
    ],
  },
  {
    ...pickFromAll("computer"),
    description:
      "ติวเตอร์คอมพิวเตอร์ สอนพื้นฐานคอมและโปรแกรมมิ่ง Python JavaScript Java พร้อมปรับพื้นฐาน Office และเตรียมสอบเข้าคอมพิวเตอร์",
    seoHeadline: "ติวเตอร์คอมพิวเตอร์ สอน Coding พื้นฐานคอม",
    seoBlurb:
      "ติวเตอร์คอมพิวเตอร์คุณภาพ สอน Python JavaScript พื้นฐานคอม Office เตรียมสอบเข้าคณะวิศวะคอมพิวเตอร์",
    seoKeywords: [
      "ติวเตอร์คอมพิวเตอร์",
      "ติว Coding",
      "เรียน Python",
      "เรียน JavaScript",
      "ติวสอบเข้าคอม",
    ],
    subs: [
      {
        slug: "basic",
        name: "คอมพื้นฐาน",
        tutorMatchTerms: ["คอมพื้นฐาน", "Office", "Word", "Excel"],
      },
      {
        slug: "programming",
        name: "โปรแกรมมิ่ง",
        tutorMatchTerms: [
          "โปรแกรมมิ่ง",
          "Programming",
          "Python",
          "JavaScript",
          "Java",
        ],
      },
    ],
    tutorMatchTerms: ["คอมพิวเตอร์", "Python", "JavaScript", "โปรแกรมมิ่ง"],
  },
  {
    ...pickFromAll("art"),
    description:
      "เรียนศิลปะตัวต่อตัว วาดรูป สีน้ำ ดิจิทัลอาร์ต กราฟิกดีไซน์ ฝึกพื้นฐานจนไปเตรียม Portfolio เข้าคณะศิลปะ",
    seoHeadline: "ติวเตอร์ศิลปะ สอนวาดรูป กราฟิกดีไซน์",
    seoBlurb:
      "ติวเตอร์ศิลปะ ครูสอนวาดรูป สีน้ำ ดิจิทัลอาร์ต กราฟิกดีไซน์ ฝึกพื้นฐานและเตรียม Portfolio",
    seoKeywords: [
      "ติวเตอร์ศิลปะ",
      "ครูสอนวาดรูป",
      "เรียนกราฟิกดีไซน์",
      "Portfolio ศิลปะ",
    ],
    subs: [
      {
        slug: "drawing",
        name: "วาดรูป",
        tutorMatchTerms: ["วาดรูป", "Drawing", "Painting"],
      },
      {
        slug: "graphic",
        name: "กราฟิกดีไซน์",
        tutorMatchTerms: ["กราฟิกดีไซน์", "Graphic Design", "Design"],
      },
    ],
    tutorMatchTerms: ["ศิลปะ", "วาดรูป", "กราฟิกดีไซน์"],
  },
  {
    ...pickFromAll("music"),
    description:
      "เรียนดนตรีตัวต่อตัวกับครูมืออาชีพ กีตาร์ กลอง เปียโน ร้องเพลง และเต้น เหมาะสำหรับผู้เริ่มต้นและต่อยอดสายอาชีพ",
    seoHeadline: "ติวเตอร์ดนตรี ครูสอนกีตาร์ เปียโน กลอง เต้น",
    seoBlurb:
      "ครูสอนดนตรีตัวต่อตัว กีตาร์ กลอง เปียโน ร้องเพลง เต้น สำหรับเด็กและผู้ใหญ่",
    seoKeywords: [
      "ติวเตอร์ดนตรี",
      "ครูสอนกีตาร์",
      "ครูสอนเปียโน",
      "ครูสอนกลอง",
      "ครูสอนเต้น",
    ],
    subs: [
      {
        slug: "guitar",
        name: "กีตาร์",
        tutorMatchTerms: ["กีตาร์", "Guitar"],
      },
      {
        slug: "drum",
        name: "กลอง",
        tutorMatchTerms: ["กลอง", "Drum", "Drums"],
      },
      {
        slug: "dance",
        name: "เต้น",
        tutorMatchTerms: ["เต้น", "Dance"],
      },
      {
        slug: "piano",
        name: "เปียโน",
        tutorMatchTerms: ["เปียโน", "Piano"],
      },
    ],
    tutorMatchTerms: ["ดนตรี", "กีตาร์", "เปียโน", "กลอง", "เต้น"],
  },
  {
    ...pickFromAll("sport"),
    description:
      "ครูสอนกีฬาและฟิตเนส ว่ายน้ำ เทควันโด แบดมินตัน โยคะ โดยโค้ชประสบการณ์สูง สอนตัวต่อตัวที่สะดวก",
    seoHeadline: "ครูสอนกีฬา ว่ายน้ำ โยคะ แบดมินตัน เทควันโด",
    seoBlurb:
      "ครูสอนกีฬาคุณภาพ ว่ายน้ำ เทควันโด แบดมินตัน โยคะ ฝึกตัวต่อตัวกับโค้ชมืออาชีพ",
    seoKeywords: [
      "ครูสอนว่ายน้ำ",
      "ครูสอนโยคะ",
      "ครูสอนแบดมินตัน",
      "ครูสอนเทควันโด",
      "เรียนกีฬาตัวต่อตัว",
    ],
    subs: [
      {
        slug: "swimming",
        name: "ว่ายน้ำ",
        tutorMatchTerms: ["ว่ายน้ำ", "Swimming"],
      },
      {
        slug: "taekwondo",
        name: "เทควันโด",
        tutorMatchTerms: ["เทควันโด", "Taekwondo"],
      },
      {
        slug: "badminton",
        name: "แบดมินตัน",
        tutorMatchTerms: ["แบดมินตัน", "Badminton"],
      },
      {
        slug: "yoga",
        name: "โยคะ",
        tutorMatchTerms: ["โยคะ", "Yoga"],
      },
    ],
    tutorMatchTerms: [
      "ว่ายน้ำ",
      "เทควันโด",
      "แบดมินตัน",
      "โยคะ",
      "กีฬา",
    ],
  },
];

function pickFromAll(slug: string): MockSubject {
  const found = MOCK_ALL_CATEGORIES.find((c) => c.slug === slug);
  if (!found) {
    // Should never happen — the homepage + taxonomy list are derived from the
    // same source of truth. If it does, fail fast at startup so the mismatch
    // is caught by build-time typing rather than in prod.
    throw new Error(`[subject/_data] unknown category slug: ${slug}`);
  }
  return found;
}

// ---- Lookups ---------------------------------------------------------------

export function findCategory(slug: string): SubjectCategory | null {
  return SUBJECT_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function findSubSubject(
  category: SubjectCategory,
  subSlug: string,
): SubSubject | null {
  return category.subs.find((s) => s.slug === subSlug) ?? null;
}

export function allCategorySlugs(): readonly string[] {
  return SUBJECT_CATEGORIES.map((c) => c.slug);
}

// ---- Province dropdown source ---------------------------------------------
// Static list used by the filter UI on /subject/* listings. Data layer for
// real tutor rows is in `@/lib/tutors/public`.

const PROVINCE_POOL = [
  "กรุงเทพมหานคร",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
  "เชียงใหม่",
  "ภูเก็ต",
  "ขอนแก่น",
  "นครราชสีมา",
  "ชลบุรี",
  "ออนไลน์",
] as const;

export const PROVINCE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "all", label: "ทุกจังหวัด" },
  ...PROVINCE_POOL.map((p) => ({ value: p, label: p })),
];


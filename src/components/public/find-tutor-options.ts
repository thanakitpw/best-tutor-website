/**
 * Static option lists used by the `/find-tutor` funnel.
 *
 * Kept in one module so Step 1 (category / age group / province) and the
 * sessionStorage draft schema stay consistent. Slugs match
 * docs/seo-migration-audit.md so pre-filled query params from HeroSearch
 * resolve 1:1 without lossy lookups.
 */

import {
  BookType,
  Calculator,
  FlaskConical,
  Landmark,
  Languages,
  Laptop,
  Music,
  Palette,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface FindTutorCategory {
  /** URL-safe slug — also matches HeroSearch `subject` param. */
  slug: string;
  /** Thai label shown to the user and sent to the API as subjectCategory. */
  label: string;
  /** Lucide icon component rendered inside the category card. */
  icon: LucideIcon;
  /** Short marketing sub-text shown under the name on the card. */
  hint: string;
  /** Optional child subjects (rendered as a dependent select). */
  subjects?: ReadonlyArray<{ slug: string; label: string }>;
}

/**
 * 9 main categories mirroring CLAUDE.md "หมวดวิชา" table.
 * Slugs match `/subject/[category]` Option-B URLs.
 */
export const FIND_TUTOR_CATEGORIES: ReadonlyArray<FindTutorCategory> = [
  {
    slug: "language",
    label: "ภาษาต่างประเทศ",
    icon: Languages,
    hint: "อังกฤษ · จีน · ญี่ปุ่น · เกาหลี",
    subjects: [
      { slug: "english", label: "ภาษาอังกฤษ" },
      { slug: "chinese", label: "ภาษาจีน" },
      { slug: "japanese", label: "ภาษาญี่ปุ่น" },
      { slug: "korean", label: "ภาษาเกาหลี" },
    ],
  },
  {
    slug: "math",
    label: "คณิตศาสตร์",
    icon: Calculator,
    hint: "ม.ต้น · ม.ปลาย · แคลคูลัส",
    subjects: [
      { slug: "math-general", label: "คณิตทั่วไป" },
      { slug: "calculus", label: "แคลคูลัส" },
      { slug: "statistics", label: "สถิติ" },
      { slug: "accounting", label: "บัญชี" },
    ],
  },
  {
    slug: "science",
    label: "วิทยาศาสตร์",
    icon: FlaskConical,
    hint: "ฟิสิกส์ · เคมี · ชีววิทยา",
    subjects: [
      { slug: "physics", label: "ฟิสิกส์" },
      { slug: "chemistry", label: "เคมี" },
      { slug: "biology", label: "ชีววิทยา" },
      { slug: "science-general", label: "วิทยาศาสตร์ทั่วไป" },
    ],
  },
  {
    slug: "thai",
    label: "ภาษาไทย",
    icon: BookType,
    hint: "อ่าน · เขียน · สอบเข้า",
  },
  {
    slug: "social",
    label: "สังคมศึกษา",
    icon: Landmark,
    hint: "ประวัติศาสตร์ · เศรษฐศาสตร์ · กฎหมาย",
    subjects: [
      { slug: "law", label: "กฎหมาย" },
      { slug: "history", label: "ประวัติศาสตร์" },
      { slug: "economics", label: "เศรษฐศาสตร์" },
    ],
  },
  {
    slug: "computer",
    label: "คอมพิวเตอร์",
    icon: Laptop,
    hint: "Coding · พื้นฐานคอม",
    subjects: [
      { slug: "computer-basic", label: "คอมพื้นฐาน" },
      { slug: "programming", label: "โปรแกรมมิ่ง" },
    ],
  },
  {
    slug: "art",
    label: "ศิลปะ",
    icon: Palette,
    hint: "วาดรูป · กราฟิกดีไซน์",
    subjects: [
      { slug: "drawing", label: "วาดรูป" },
      { slug: "graphic-design", label: "กราฟิกดีไซน์" },
    ],
  },
  {
    slug: "music",
    label: "ดนตรี",
    icon: Music,
    hint: "กีตาร์ · กลอง · เปียโน · เต้น",
    subjects: [
      { slug: "guitar", label: "กีตาร์" },
      { slug: "drums", label: "กลอง" },
      { slug: "piano", label: "เปียโน" },
      { slug: "dance", label: "เต้น" },
    ],
  },
  {
    slug: "sport",
    label: "กีฬา",
    icon: Trophy,
    hint: "ว่ายน้ำ · เทควันโด · โยคะ",
    subjects: [
      { slug: "swimming", label: "ว่ายน้ำ" },
      { slug: "taekwondo", label: "เทควันโด" },
      { slug: "badminton", label: "แบดมินตัน" },
      { slug: "yoga", label: "โยคะ" },
    ],
  },
];

/**
 * Age / goal groups — sent to the API as `studentAgeGroup`.
 * Values also mirror HeroSearch `grade` param with extra granularity.
 */
export const FIND_TUTOR_AGE_GROUPS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "kindergarten", label: "อนุบาล" },
  { value: "primary", label: "ประถมศึกษา" },
  { value: "secondary", label: "มัธยมต้น" },
  { value: "high-school", label: "มัธยมปลาย" },
  { value: "university-entrance", label: "เข้ามหาวิทยาลัย" },
  { value: "university", label: "ปริญญาตรี+" },
  { value: "working", label: "ทำงาน / ทั่วไป" },
];

/**
 * Thai provinces (77) + "ออนไลน์เท่านั้น" sentinel for location-independent
 * matching. Sorted alphabetically in Thai. Labels stored verbatim so they
 * flow straight into the Lead DB row.
 */
export const THAI_PROVINCES: ReadonlyArray<string> = [
  "ออนไลน์เท่านั้น",
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
];

/**
 * Best-effort map between HeroSearch `subject` query param and a Step-1
 * category slug. Returns null if the query value is either empty or not a
 * recognised subject — caller should leave the form in its default state.
 */
export function resolveCategorySlugFromQuery(
  queryValue: string | undefined,
): { categorySlug: string; subjectSlug?: string } | null {
  if (!queryValue) return null;
  const raw = queryValue.trim().toLowerCase();
  if (!raw) return null;

  // Exact category slug match first
  for (const cat of FIND_TUTOR_CATEGORIES) {
    if (cat.slug === raw) return { categorySlug: cat.slug };
  }
  // Nested subject match (english → language/english)
  for (const cat of FIND_TUTOR_CATEGORIES) {
    const sub = cat.subjects?.find((s) => s.slug === raw);
    if (sub) return { categorySlug: cat.slug, subjectSlug: sub.slug };
  }
  return null;
}

/**
 * Best-effort map for HeroSearch `grade` param.
 * HeroSearch uses: kindergarten · primary · secondary · high-school · university · working
 * We extend with `university-entrance`. Unknown → null so caller skips.
 */
export function resolveAgeGroupFromQuery(
  queryValue: string | undefined,
): string | null {
  if (!queryValue) return null;
  const raw = queryValue.trim().toLowerCase();
  const hit = FIND_TUTOR_AGE_GROUPS.find((g) => g.value === raw);
  return hit?.value ?? null;
}

/**
 * Best-effort map for HeroSearch `location` param (`online`, `bangkok`, ...).
 * Returns a Thai province string compatible with the `THAI_PROVINCES` list,
 * or null if the value is unrecognised.
 */
export function resolveProvinceFromQuery(
  queryValue: string | undefined,
): string | null {
  if (!queryValue) return null;
  const raw = queryValue.trim().toLowerCase();
  const MAP: Record<string, string> = {
    online: "ออนไลน์เท่านั้น",
    bangkok: "กรุงเทพมหานคร",
    nonthaburi: "นนทบุรี",
    pathumthani: "ปทุมธานี",
    samutprakan: "สมุทรปราการ",
    chonburi: "ชลบุรี",
    chiangmai: "เชียงใหม่",
  };
  return MAP[raw] ?? null;
}

/** Utility: find a category definition by slug. */
export function getCategoryBySlug(
  slug: string | undefined,
): FindTutorCategory | undefined {
  if (!slug) return undefined;
  return FIND_TUTOR_CATEGORIES.find((c) => c.slug === slug);
}

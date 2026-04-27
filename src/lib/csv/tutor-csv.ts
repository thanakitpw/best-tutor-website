/**
 * Shared CSV schema for tutor bulk export/import.
 *
 * Single source of truth for column order, header labels, and per-row
 * validation. The export route serializes a row, the import route parses
 * it back, and both must agree on shape — keeping it here avoids drift.
 */
import { z } from "zod";
import type { Gender, TutorStatus } from "@prisma/client";

// ── Column definitions ────────────────────────────────────────────────────────

/**
 * Column order matters: this is the order written by export and the order
 * shown in the template. Header keys are also the keys of each parsed CSV
 * row object.
 */
export const TUTOR_CSV_COLUMNS = [
  { key: "nickname", label: "ชื่อเล่น (required)" },
  { key: "firstName", label: "ชื่อจริง (required)" },
  { key: "lastName", label: "นามสกุล (required)" },
  { key: "gender", label: "เพศ (MALE/FEMALE/OTHER)" },
  { key: "email", label: "อีเมล" },
  { key: "phone", label: "เบอร์โทร" },
  { key: "lineId", label: "Line ID" },
  { key: "profileImageUrl", label: "URL รูปโปรไฟล์" },
  { key: "education", label: "การศึกษา" },
  { key: "occupation", label: "อาชีพ" },
  { key: "teachingExperienceYears", label: "ประสบการณ์สอน (ปี)" },
  { key: "teachingStyle", label: "แนวการสอน / bio" },
  { key: "subjectSlugs", label: "วิชาที่สอน (slug คั่นด้วย ;)" },
  { key: "address", label: "จังหวัดที่สอน" },
  { key: "vehicleType", label: "การเดินทาง" },
  { key: "status", label: "สถานะ (PENDING/APPROVED/REJECTED/INACTIVE)" },
  { key: "isPopular", label: "ติวเตอร์ยอดนิยม (true/false)" },
  { key: "slug", label: "slug (เว้นว่างให้สร้างอัตโนมัติ)" },
] as const;

export type TutorCsvKey = (typeof TUTOR_CSV_COLUMNS)[number]["key"];

export const TUTOR_CSV_HEADERS: TutorCsvKey[] = TUTOR_CSV_COLUMNS.map(
  (c) => c.key,
);

/** Example row used in the downloadable template. */
export const TUTOR_CSV_TEMPLATE_EXAMPLE: Record<TutorCsvKey, string> = {
  nickname: "ครูวาวา",
  firstName: "ปณิศา",
  lastName: "เจริญสุข",
  gender: "FEMALE",
  email: "wawa@example.com",
  phone: "0812345678",
  lineId: "@krwawa",
  profileImageUrl: "",
  education: "จุฬาลงกรณ์มหาวิทยาลัย คณะอักษรศาสตร์",
  occupation: "ครูภาษาอังกฤษ",
  teachingExperienceYears: "5",
  teachingStyle: "เน้นพื้นฐานก่อน ใช้บทสนทนาในชีวิตจริง",
  subjectSlugs: "english;chinese",
  address: "กรุงเทพมหานคร",
  vehicleType: "รถยนต์",
  status: "APPROVED",
  isPopular: "false",
  slug: "",
};

// ── Validation ────────────────────────────────────────────────────────────────

const STATUS_VALUES = ["PENDING", "APPROVED", "REJECTED", "INACTIVE"] as const;
const GENDER_VALUES = ["MALE", "FEMALE", "OTHER"] as const;

/**
 * Per-row import schema. Every field is a string at parse time (CSV); we
 * coerce numbers/booleans here. `subjectSlugs` is split on `;` after trim.
 *
 * Treat empty strings as "absent" for optional fields so a fresh template
 * with blanks doesn't fail validation.
 */
const optionalString = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

export const tutorCsvRowSchema = z.object({
  nickname: z.string().trim().min(1, "ชื่อเล่นว่างไม่ได้").max(50),
  firstName: z.string().trim().min(1, "ชื่อจริงว่างไม่ได้").max(100),
  lastName: z.string().trim().min(1, "นามสกุลว่างไม่ได้").max(100),
  gender: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(z.enum([...GENDER_VALUES, ""]).transform((v) => (v === "" ? null : (v as Gender))))
    .nullable()
    .optional(),
  email: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(
      z
        .union([z.string().email("รูปแบบอีเมลไม่ถูกต้อง"), z.null()])
        .nullable(),
    )
    .nullable()
    .optional(),
  phone: optionalString.optional(),
  lineId: optionalString.optional(),
  profileImageUrl: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(
      z
        .union([z.string().url("URL รูปไม่ถูกต้อง"), z.null()])
        .nullable(),
    )
    .nullable()
    .optional(),
  education: optionalString.optional(),
  occupation: optionalString.optional(),
  teachingExperienceYears: z.preprocess(
    (v) => {
      if (typeof v !== "string") return v;
      const trimmed = v.trim();
      return trimmed === "" ? 0 : Number(trimmed);
    },
    z.number().int().min(0).max(80),
  ),
  teachingStyle: optionalString.optional(),
  subjectSlugs: z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  address: optionalString.optional(),
  vehicleType: optionalString.optional(),
  status: z
    .string()
    .trim()
    .transform((v) => (v === "" ? "PENDING" : v.toUpperCase()))
    .pipe(z.enum(STATUS_VALUES))
    .transform((v) => v as TutorStatus),
  isPopular: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase())
    .pipe(z.enum(["true", "false", "1", "0", "yes", "no", ""]))
    .transform((v) => v === "true" || v === "1" || v === "yes"),
  slug: optionalString.optional(),
});

export type TutorCsvRow = z.infer<typeof tutorCsvRowSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Render Prisma Tutor row + subject slugs to a flat CSV row map. */
export function tutorToCsvRecord(input: {
  nickname: string;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  email: string | null;
  phone: string | null;
  lineId: string | null;
  profileImageUrl: string | null;
  education: string | null;
  occupation: string | null;
  teachingExperienceYears: number;
  teachingStyle: string | null;
  address: string | null;
  vehicleType: string | null;
  status: TutorStatus;
  isPopular: boolean;
  slug: string;
  subjectSlugs: string[];
}): Record<TutorCsvKey, string> {
  return {
    nickname: input.nickname,
    firstName: input.firstName,
    lastName: input.lastName,
    gender: input.gender ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
    lineId: input.lineId ?? "",
    profileImageUrl: input.profileImageUrl ?? "",
    education: input.education ?? "",
    occupation: input.occupation ?? "",
    teachingExperienceYears: String(input.teachingExperienceYears),
    teachingStyle: input.teachingStyle ?? "",
    subjectSlugs: input.subjectSlugs.join(";"),
    address: input.address ?? "",
    vehicleType: input.vehicleType ?? "",
    status: input.status,
    isPopular: input.isPopular ? "true" : "false",
    slug: input.slug,
  };
}

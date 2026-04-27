/**
 * POST /api/admin/tutors/import
 *
 * Bulk import tutors from a CSV file. Strategy: parse → validate each row
 * with Zod → upsert (match by email if present, else by slug) → write
 * tutor_subjects junction rows.
 *
 * Failed rows are skipped, not aborted — user picked option (a). The
 * response lists exactly which rows failed and why so they can fix the
 * sheet and re-upload only the broken rows.
 *
 * Note: file uploads come as multipart/form-data with field name "file".
 */
import Papa from "papaparse";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { tutorCsvRowSchema, type TutorCsvRow } from "@/lib/csv/tutor-csv";
import { buildSlug, ensureUniqueSlug } from "@/lib/utils/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 1000;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

export type TutorImportResult = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: Array<{
    row: number; // 1-indexed; matches the line number a user sees in Excel (header is row 1)
    errors: string[];
  }>;
};

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail(401, "กรุณาเข้าสู่ระบบก่อน");

    // --- Read multipart file -------------------------------------------------
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return fail(415, "ต้องส่งไฟล์เป็น multipart/form-data");
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return fail(400, "ไม่พบไฟล์ CSV");
    }
    if (file.size === 0) return fail(400, "ไฟล์ว่าง");
    if (file.size > MAX_FILE_BYTES) return fail(413, "ไฟล์ใหญ่เกิน 5MB");

    // --- Parse CSV -----------------------------------------------------------
    const text = await file.text();
    // Strip UTF-8 BOM if present (Excel-saved files include one).
    const cleaned = text.replace(/^﻿/, "");
    const parsed = Papa.parse<Record<string, string>>(cleaned, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
    });

    if (parsed.errors.length > 0) {
      const message = parsed.errors[0]?.message ?? "อ่านไฟล์ CSV ไม่ได้";
      return fail(400, `อ่าน CSV ไม่ได้: ${message}`);
    }
    const rows = parsed.data;
    if (rows.length === 0) return fail(400, "CSV ไม่มีข้อมูล");
    if (rows.length > MAX_ROWS) {
      return fail(413, `แถวเกินจำกัด — สูงสุด ${MAX_ROWS} แถวต่อครั้ง`);
    }

    // --- Validate each row ---------------------------------------------------
    const validRows: Array<{ rowNum: number; data: TutorCsvRow }> = [];
    const failed: TutorImportResult["failed"] = [];

    for (let i = 0; i < rows.length; i += 1) {
      const rowNum = i + 2; // header is row 1 in Excel; data starts at 2
      const result = tutorCsvRowSchema.safeParse(rows[i]);
      if (result.success) {
        validRows.push({ rowNum, data: result.data });
      } else {
        failed.push({
          row: rowNum,
          errors: result.error.issues.map(
            (iss) => `${iss.path.join(".") || "row"}: ${iss.message}`,
          ),
        });
      }
    }

    // --- Resolve subject slugs once for the whole batch ----------------------
    const allSlugs = Array.from(
      new Set(validRows.flatMap((r) => r.data.subjectSlugs)),
    );
    const subjectsBySlug = new Map<string, { id: string; name: string }>();
    if (allSlugs.length > 0) {
      const subjects = await prisma.subject.findMany({
        where: { slug: { in: allSlugs } },
        select: { id: true, slug: true, name: true },
      });
      for (const s of subjects) {
        subjectsBySlug.set(s.slug, { id: s.id, name: s.name });
      }
    }

    // --- Upsert each row sequentially ----------------------------------------
    // We do this in series rather than $transaction so a single bad row can't
    // roll back already-imported rows. The user explicitly asked for "skip
    // bad rows, keep the good ones".
    let created = 0;
    let updated = 0;

    for (const { rowNum, data } of validRows) {
      try {
        // Match unknown subject slugs upfront so we can fail the row cleanly.
        const matchedSubjects = data.subjectSlugs
          .map((slug) => ({ slug, sub: subjectsBySlug.get(slug) }))
          .filter((m) => m.sub !== undefined) as Array<{
          slug: string;
          sub: { id: string; name: string };
        }>;
        const unknownSlugs = data.subjectSlugs.filter(
          (s) => !subjectsBySlug.has(s),
        );
        if (unknownSlugs.length > 0) {
          failed.push({
            row: rowNum,
            errors: [`ไม่รู้จัก subject slug: ${unknownSlugs.join(", ")}`],
          });
          continue;
        }

        const subjectsTaught =
          matchedSubjects.length > 0
            ? matchedSubjects.map((m) => m.sub.name).join(", ")
            : null;

        // --- Find existing by email > slug ---------------------------------
        const existing =
          (data.email
            ? await prisma.tutor.findFirst({
                where: { email: data.email },
                select: { id: true },
              })
            : null) ??
          (data.slug
            ? await prisma.tutor.findUnique({
                where: { slug: data.slug },
                select: { id: true },
              })
            : null);

        const writeData = {
          nickname: data.nickname,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          lineId: data.lineId ?? null,
          profileImageUrl: data.profileImageUrl ?? null,
          education: data.education ?? null,
          occupation: data.occupation ?? null,
          teachingExperienceYears: data.teachingExperienceYears,
          teachingStyle: data.teachingStyle ?? null,
          subjectsTaught,
          address: data.address ?? null,
          vehicleType: data.vehicleType ?? null,
          status: data.status,
          isPopular: data.isPopular,
        };

        if (existing) {
          // --- Update + replace junction rows ------------------------------
          await prisma.$transaction([
            prisma.tutor.update({
              where: { id: existing.id },
              data: writeData,
            }),
            prisma.tutorSubject.deleteMany({ where: { tutorId: existing.id } }),
            ...(matchedSubjects.length > 0
              ? [
                  prisma.tutorSubject.createMany({
                    data: matchedSubjects.map((m) => ({
                      tutorId: existing.id,
                      subjectId: m.sub.id,
                    })),
                  }),
                ]
              : []),
          ]);
          updated += 1;
        } else {
          // --- Create with auto-slug ----------------------------------------
          const baseSlug =
            data.slug ||
            buildSlug(
              [data.nickname, data.firstName, data.lastName],
              data.nickname,
            );
          const slug = await ensureUniqueSlug(baseSlug, async (c) => {
            const found = await prisma.tutor.findUnique({
              where: { slug: c },
              select: { id: true },
            });
            return Boolean(found);
          });
          const tutor = await prisma.tutor.create({
            data: { ...writeData, slug },
            select: { id: true },
          });
          if (matchedSubjects.length > 0) {
            await prisma.tutorSubject.createMany({
              data: matchedSubjects.map((m) => ({
                tutorId: tutor.id,
                subjectId: m.sub.id,
              })),
            });
          }
          created += 1;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "บันทึกไม่สำเร็จ";
        failed.push({ row: rowNum, errors: [message] });
      }
    }

    const result: TutorImportResult = {
      total: rows.length,
      created,
      updated,
      skipped: failed.length,
      failed,
    };
    return ok(result);
  } catch (error) {
    console.error("[POST /api/admin/tutors/import] failed:", error);
    return fail(500, "นำเข้าไฟล์ไม่สำเร็จ");
  }
}

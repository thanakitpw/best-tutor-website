/**
 * GET /api/admin/tutors/export
 *
 * Streams all tutors as a CSV download. Auth-only. Includes the tutor's
 * subject slugs (semicolon-joined) so the resulting file round-trips
 * cleanly back through the import endpoint.
 *
 * Query params:
 *   ?template=true → returns an empty CSV with header + a single example row
 *
 * The BOM prefix (`﻿`) is required so Excel auto-detects UTF-8 and
 * renders Thai characters correctly. Without it Excel falls back to
 * cp874/cp1252 and Thai shows as garbled boxes.
 */
import Papa from "papaparse";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fail } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import {
  TUTOR_CSV_HEADERS,
  TUTOR_CSV_TEMPLATE_EXAMPLE,
  tutorToCsvRecord,
} from "@/lib/csv/tutor-csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvResponse(content: string, filename: string) {
  // BOM ensures Excel reads the file as UTF-8 (otherwise Thai is garbled).
  const body = `﻿${content}`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail(401, "กรุณาเข้าสู่ระบบก่อน");

    const url = new URL(request.url);
    const isTemplate = url.searchParams.get("template") === "true";

    if (isTemplate) {
      const csv = Papa.unparse({
        fields: [...TUTOR_CSV_HEADERS],
        data: [TUTOR_CSV_TEMPLATE_EXAMPLE],
      });
      return csvResponse(csv, "tutors-template.csv");
    }

    // --- Full export ---------------------------------------------------------
    const tutors = await prisma.tutor.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        tutorSubjects: {
          select: { subject: { select: { slug: true } } },
        },
      },
    });

    const rows = tutors.map((t) =>
      tutorToCsvRecord({
        nickname: t.nickname,
        firstName: t.firstName,
        lastName: t.lastName,
        gender: t.gender,
        email: t.email,
        phone: t.phone,
        lineId: t.lineId,
        profileImageUrl: t.profileImageUrl,
        education: t.education,
        occupation: t.occupation,
        teachingExperienceYears: t.teachingExperienceYears,
        teachingStyle: t.teachingStyle,
        address: t.address,
        vehicleType: t.vehicleType,
        status: t.status,
        isPopular: t.isPopular,
        slug: t.slug,
        subjectSlugs: t.tutorSubjects.map((ts) => ts.subject.slug),
      }),
    );

    const csv = Papa.unparse({
      fields: [...TUTOR_CSV_HEADERS],
      data: rows,
    });

    const stamp = new Date().toISOString().slice(0, 10);
    return csvResponse(csv, `tutors-${stamp}.csv`);
  } catch (error) {
    console.error("[GET /api/admin/tutors/export] failed:", error);
    return fail(500, "ส่งออกไฟล์ไม่สำเร็จ");
  }
}

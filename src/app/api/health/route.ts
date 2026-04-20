import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Basic liveness probe. Returns 200 if the Next.js server is up.
 * Does NOT verify DB connectivity (to keep it cheap + DB-dependency-free).
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

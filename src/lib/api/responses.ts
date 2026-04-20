/**
 * Unified API response helpers.
 *
 * Shape:
 *   success → { ok: true, data: T }
 *   failure → { ok: false, error: string, issues?: ... }
 *
 * Caller chooses the HTTP status; helpers just format + stamp headers so the
 * shape stays consistent across every public endpoint.
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  error: string;
  issues?: Array<{ path: string; message: string }>;
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

type OkInit = {
  status?: number;
  /**
   * Optional Cache-Control header. Routes that want CDN caching can pass
   * e.g. `s-maxage=60, stale-while-revalidate=600`.
   */
  cacheControl?: string;
  /** Additional response headers. */
  headers?: Record<string, string>;
};

export function ok<T>(data: T, init: OkInit = {}): NextResponse<ApiSuccess<T>> {
  const headers = new Headers(init.headers);
  if (init.cacheControl) {
    headers.set("Cache-Control", init.cacheControl);
  }
  return NextResponse.json(
    { ok: true, data } satisfies ApiSuccess<T>,
    { status: init.status ?? 200, headers },
  );
}

export function fail(
  status: number,
  error: string,
  extras?: { issues?: ApiFailure["issues"] },
): NextResponse<ApiFailure> {
  const body: ApiFailure = { ok: false, error };
  if (extras?.issues?.length) {
    body.issues = extras.issues;
  }
  return NextResponse.json(body, { status });
}

/** Format a ZodError into the shape expected by `fail()`. */
export function zodIssues(error: ZodError): ApiFailure["issues"] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function failValidation(error: ZodError, message = "ข้อมูลไม่ถูกต้อง") {
  return fail(400, message, { issues: zodIssues(error) });
}

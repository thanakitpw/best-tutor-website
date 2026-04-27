/**
 * End-to-end CRUD tests for /api/admin/tutors using cookie-based auth
 * (matching the Supabase SSR helper the API routes use).
 *
 * Usage: npx tsx scripts/test-crud.ts
 */
import { config as loadDotenv } from "dotenv";
import { createServerClient } from "@supabase/ssr";

loadDotenv({ path: ".env.local" });

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@besttutorthailand.com";
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "BestTutor2026";

const cookieStore = new Map<string, string>();

function cookieHeader(): string {
  return [...cookieStore].map(([k, v]) => `${k}=${v}`).join("; ");
}

// ---- Test runner ---------------------------------------------------------

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  process.stdout.write(`  ${name}... `);
  try {
    await fn();
    process.stdout.write("✓\n");
    passed += 1;
  } catch (err) {
    process.stdout.write("✗\n");
    console.error("    →", (err as Error).message);
    failed += 1;
  }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function signIn() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          [...cookieStore].map(([name, value]) => ({ name, value })),
        setAll: (toSet) => {
          for (const c of toSet) cookieStore.set(c.name, c.value);
        },
      },
    },
  );
  const { error } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (error) throw new Error(`Sign-in failed: ${error.message}`);
}

type Envelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface ApiResult<T> {
  status: number;
  body: Envelope<T> | null;
  raw: string;
}

async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) ?? {}),
    Cookie: cookieHeader(),
  };
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const raw = await res.text();
  let body: Envelope<T> | null = null;
  try {
    body = raw ? (JSON.parse(raw) as Envelope<T>) : null;
  } catch {
    body = null;
  }
  return { status: res.status, body, raw };
}

function unwrapData<T>(r: ApiResult<T>): T {
  assert(r.body && r.body.ok, `expected ok envelope, got: ${r.raw}`);
  return r.body.data;
}

// ---- Tests ---------------------------------------------------------------

interface ListResp {
  items: Array<{ id: string }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TutorDetail {
  id: string;
  slug: string;
  nickname: string;
  firstName: string;
  lastName: string;
  subjectsTaught: string;
  address: string;
  education: string;
  teachingStyle: string | null;
  teachingExperienceYears: number;
  status: string;
  isPopular: boolean;
}

async function main() {
  console.log(`\n→ Signing in as ${EMAIL}...`);
  await signIn();
  console.log("  ✓ session cookies acquired\n");

  let createdId = "";

  console.log("AUTH GUARD:");
  await test("GET /api/admin/tutors WITHOUT cookies → 401", async () => {
    const res = await fetch(`${BASE}/api/admin/tutors`);
    assert(res.status === 401, `expected 401, got ${res.status}`);
  });

  console.log("\nLIST:");
  let initialTotal = 0;
  await test("GET /api/admin/tutors → 200 + paginated envelope", async () => {
    const r = await api<ListResp>("/api/admin/tutors?page=1&limit=5");
    assert(r.status === 200, `status ${r.status}: ${r.raw}`);
    const data = unwrapData(r);
    assert(Array.isArray(data.items), "items not array");
    assert(typeof data.total === "number", "total not number");
    initialTotal = data.total;
  });

  console.log("\nCREATE:");
  await test("POST /api/admin/tutors → 201 + id/slug", async () => {
    const r = await api<{ id: string; slug: string }>("/api/admin/tutors", {
      method: "POST",
      body: JSON.stringify({
        nickname: "ครูเทสต์",
        firstName: "ทดสอบ",
        lastName: "ระบบ",
        subjectsTaught: "คณิตศาสตร์, ฟิสิกส์",
        address: "กรุงเทพมหานคร",
        education: "จุฬาฯ คณะวิทยาศาสตร์",
        teachingStyle: "เน้นพื้นฐานก่อน",
        teachingExperienceYears: 5,
      }),
    });
    assert(r.status === 201, `status ${r.status}: ${r.raw}`);
    const data = unwrapData(r);
    assert(typeof data.id === "string" && data.id.length > 0, "no id");
    assert(typeof data.slug === "string" && data.slug.length > 0, "no slug");
    createdId = data.id;
  });

  await test("POST validation → 400 on missing required fields", async () => {
    const r = await api("/api/admin/tutors", {
      method: "POST",
      body: JSON.stringify({ nickname: "x" }),
    });
    assert(r.status === 400, `expected 400, got ${r.status}`);
  });

  console.log("\nREAD (single):");
  await test(`GET /api/admin/tutors/[id] → 200 + correct fields`, async () => {
    assert(createdId, "no createdId — POST must have failed");
    const r = await api<TutorDetail>(`/api/admin/tutors/${createdId}`);
    assert(r.status === 200, `status ${r.status}: ${r.raw}`);
    const t = unwrapData(r);
    assert(t.id === createdId, "id mismatch");
    assert(t.nickname === "ครูเทสต์", `nickname=${t.nickname}`);
    assert(t.subjectsTaught === "คณิตศาสตร์, ฟิสิกส์", "subjects mismatch");
    assert(t.teachingExperienceYears === 5, `years=${t.teachingExperienceYears}`);
    assert(t.status === "APPROVED", `status=${t.status}`);
  });

  await test("GET /[id] non-existent → 404", async () => {
    const r = await api("/api/admin/tutors/clxxxxxxxxxxxxxxxxxxxxxxx");
    assert(r.status === 404, `expected 404, got ${r.status}`);
  });

  console.log("\nUPDATE (profile fields):");
  await test("PATCH profile fields → 200 + persisted", async () => {
    const r = await api(`/api/admin/tutors/${createdId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nickname: "ครูเทสต์2",
        teachingStyle: "อัปเดตแล้ว — เน้นทำข้อสอบจริง",
        teachingExperienceYears: 10,
      }),
    });
    assert(r.status === 200, `status ${r.status}: ${r.raw}`);

    const get = await api<TutorDetail>(`/api/admin/tutors/${createdId}`);
    const t = unwrapData(get);
    assert(t.nickname === "ครูเทสต์2", `nickname=${t.nickname}`);
    assert(
      t.teachingStyle === "อัปเดตแล้ว — เน้นทำข้อสอบจริง",
      "teachingStyle not persisted",
    );
    assert(t.teachingExperienceYears === 10, `years=${t.teachingExperienceYears}`);
    assert(t.firstName === "ทดสอบ", "firstName mutated");
  });

  await test("PATCH status only → 200 (back-compat)", async () => {
    const r = await api(`/api/admin/tutors/${createdId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "INACTIVE" }),
    });
    assert(r.status === 200, `status ${r.status}: ${r.raw}`);
    const get = await api<TutorDetail>(`/api/admin/tutors/${createdId}`);
    assert(unwrapData(get).status === "INACTIVE", "status not persisted");
  });

  await test("PATCH empty body → 400", async () => {
    const r = await api(`/api/admin/tutors/${createdId}`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    assert(r.status === 400, `expected 400, got ${r.status}`);
  });

  console.log("\nDELETE:");
  await test("DELETE /[id] → 200 + record gone", async () => {
    const r = await api<{ id: string }>(`/api/admin/tutors/${createdId}`, {
      method: "DELETE",
    });
    assert(r.status === 200, `status ${r.status}: ${r.raw}`);
    const data = unwrapData(r);
    assert(data.id === createdId, "id mismatch");

    const get = await api(`/api/admin/tutors/${createdId}`);
    assert(get.status === 404, `expected 404 after delete, got ${get.status}`);
  });

  await test("DELETE non-existent → 404", async () => {
    const r = await api(`/api/admin/tutors/${createdId}`, { method: "DELETE" });
    assert(r.status === 404, `expected 404, got ${r.status}`);
  });

  await test("LIST total returned to baseline", async () => {
    const r = await api<ListResp>("/api/admin/tutors?page=1&limit=5");
    const total = unwrapData(r).total;
    assert(total === initialTotal, `total drifted: before=${initialTotal} after=${total}`);
  });

  console.log(`\n${passed + failed} tests, ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

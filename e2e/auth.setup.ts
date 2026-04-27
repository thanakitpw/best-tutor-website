import { test as setup, expect } from "@playwright/test";

/**
 * Sign in once and persist the Supabase auth cookies to disk so that
 * downstream `admin` project tests can reuse the session without
 * re-authenticating.
 *
 * Reads creds from env (TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD) with
 * sensible local defaults — DO NOT commit prod creds.
 */
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@besttutorthailand.com";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "BestTutor2026";

const STORAGE_PATH = "e2e/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("อีเมล").fill(ADMIN_EMAIL);
  await page.getByLabel("รหัสผ่าน").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();

  // After successful sign-in we land on /admin/tutors (the tutor list).
  await page.waitForURL(/\/admin\/tutors(\/|$)/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /จัดการติวเตอร์/ })).toBeVisible();

  await page.context().storageState({ path: STORAGE_PATH });
});

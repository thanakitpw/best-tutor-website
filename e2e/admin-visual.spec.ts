import { test, expect } from "@playwright/test";

/**
 * Visual regression + design-token tests for the admin panel.
 *
 * Run modes:
 *   npm run test:e2e -- --update-snapshots   # capture/refresh baselines
 *   npm run test:e2e                          # compare against baselines
 *
 * Baselines live next to the spec under `__screenshots__/`.
 *
 * Note: login page tests use a fresh context (no admin storageState).
 * With a Supabase session cookie present, Next.js dev hits 404 when
 * navigating directly to `/admin/login` (likely a route-group/RSC
 * prefetch quirk). The login page is public anyway, so we test it
 * unauthenticated — closer to how a real user sees it.
 */

// Brand tokens — keep in sync with src/app/globals.css / Tailwind config.
const BRAND_PRIMARY_RGB = "rgb(4, 107, 210)"; // #046bd2
const BRAND_HEADING_RGB = "rgb(30, 41, 59)";  // #1e293b
const ALT_BG_RGB = "rgb(240, 245, 250)";      // #F0F5FA

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC — /admin/login. No auth required; clear cookies on entry.
// ────────────────────────────────────────────────────────────────────────────

test.describe("login page (public)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("visual baseline", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("login.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("submit button uses brand primary token", async ({ page }) => {
    await page.goto("/admin/login");
    const btn = page.getByRole("button", { name: "เข้าสู่ระบบ" });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveCSS("background-color", BRAND_PRIMARY_RGB);
    await expect(btn).toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("page background is alt-bg token", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Wrapper carries the alt-bg utility class.
    const wrapper = page.locator(".bg-\\[\\#F0F5FA\\]").first();
    await expect(wrapper).toHaveCSS("background-color", ALT_BG_RGB);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// ADMIN — pages that require an authenticated session (project default).
// ────────────────────────────────────────────────────────────────────────────

test.describe("authenticated admin pages", () => {
  test("tutor list visual baseline", async ({ page }) => {
    await page.goto("/admin/tutors");
    await expect(page.getByRole("heading", { name: /จัดการติวเตอร์/ })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("tutors-list.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("add tutor form visual baseline", async ({ page }) => {
    await page.goto("/admin/tutors/new");
    await expect(page.getByRole("heading", { name: "เพิ่มติวเตอร์" })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("tutors-new.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("sidebar active nav uses brand primary", async ({ page }) => {
    await page.goto("/admin/tutors");
    const navLink = page.getByRole("link", { name: /ติวเตอร์/ }).first();
    await expect(navLink).toBeVisible();
    await expect(navLink).toHaveCSS("color", BRAND_PRIMARY_RGB);
  });

  test("page heading uses heading color token", async ({ page }) => {
    await page.goto("/admin/tutors/new");
    const heading = page.getByRole("heading", { name: "เพิ่มติวเตอร์" });
    await expect(heading).toHaveCSS("color", BRAND_HEADING_RGB);
  });
});

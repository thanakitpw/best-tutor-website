import { test, expect } from "@playwright/test";

/**
 * Homepage smoke test.
 *
 * Verifies the public home page renders with the expected brand title.
 * Run with: `npm run test:e2e` (requires a dev/staging server).
 */
test("homepage loads and has brand in title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Best Tutor Thailand/i);
});

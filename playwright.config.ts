import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for end-to-end tests.
 *
 * Run locally with:
 *   npm run test:e2e       # headless, all projects
 *   npm run test:e2e:ui    # interactive UI mode
 *
 * Install browsers (once):
 *   npx playwright install chromium firefox
 */
export default defineConfig({
  testDir: "./e2e",
  // 60s — Turbopack first-compile of admin pages can take 10–20s on cold cache.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Public smoke tests — no auth needed.
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/admin-*.spec.ts", "**/auth.setup.ts"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: ["**/admin-*.spec.ts", "**/auth.setup.ts"],
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      testIgnore: ["**/admin-*.spec.ts", "**/auth.setup.ts"],
    },

    // Auth bootstrap — runs once, persists cookies to e2e/.auth/admin.json.
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    // Admin suite — chromium only (stable visual baselines), reuses session.
    {
      name: "admin",
      testMatch: /admin-.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
    },
  ],

  // Boot the Next.js dev server for local runs. Skipped in CI because
  // CI currently does not provision a database (E2E is intentionally
  // excluded from the CI pipeline — run manually against a staging env).
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});

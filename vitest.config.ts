import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest configuration for unit and integration tests.
 *
 * - jsdom environment for testing React components / browser APIs
 * - @/ alias matches tsconfig.json `paths`
 * - Excludes Playwright e2e tests (handled by playwright.config.ts)
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "src/**/*.test.{ts,tsx}",
      "tests/**/*.test.{ts,tsx}",
    ],
    exclude: [
      "node_modules/**",
      ".next/**",
      "e2e/**",
      "tests/e2e/**",
    ],
    css: false,
  },
});

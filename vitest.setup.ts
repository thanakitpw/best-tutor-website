import "@testing-library/jest-dom/vitest";

/**
 * Global test setup shared by all Vitest suites.
 *
 * - Registers jest-dom custom matchers (e.g. toBeInTheDocument).
 *
 * NOTE: React Testing Library's `cleanup()` is auto-called between tests
 * in recent versions when `globals: true` is set in vitest.config.ts, so we
 * don't wire it here. Add an explicit afterEach(cleanup) only if a future
 * test reveals leakage. Also note: @testing-library/react requires
 * @testing-library/dom to be installed as a peer dep — the Lead should
 * ensure that's present before React component tests are added.
 */

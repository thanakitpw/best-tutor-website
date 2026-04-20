import { describe, it, expect } from "vitest";
import { cn } from "./utils";

/**
 * Demo test for cn() helper — verifies the Vitest + jsdom setup works.
 * Actual feature tests live alongside the code they exercise.
 */
describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("de-duplicates conflicting tailwind utilities (tailwind-merge)", () => {
    // `px-4` should win over `px-2` because it appears later.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("px-2", false && "hidden", null, undefined, "py-1")).toBe(
      "px-2 py-1",
    );
  });
});

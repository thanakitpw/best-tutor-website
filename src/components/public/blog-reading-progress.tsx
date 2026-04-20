"use client";

import { useEffect, useState } from "react";

interface BlogReadingProgressProps {
  /** CSS selector of the scrollable article element to track. */
  targetSelector?: string;
}

/**
 * Thin colored bar fixed to the top of the viewport, showing how far the
 * reader has progressed through the article. Measures relative to the
 * target article's height — fallbacks to `document.body` if the target
 * isn't mounted yet (rare, but guards against race conditions).
 *
 * Kept separate from the layout so it only loads on article pages and has
 * no effect on other routes' performance.
 */
export function BlogReadingProgress({
  targetSelector = "#article-body",
}: BlogReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = document.querySelector(targetSelector);
      const viewportH = window.innerHeight;
      if (!target) {
        setProgress(0);
        return;
      }
      const rect = target.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop + viewportH;
      const percent = Math.max(
        0,
        Math.min(1, scrolled / Math.max(1, articleHeight)),
      );
      setProgress(percent);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

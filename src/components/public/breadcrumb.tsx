import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
  /** Optional light/dark mode — "light" for page headers on coloured
   * backgrounds (hero sections), "default" for body placement. */
  variant?: "default" | "light";
  className?: string;
}

/**
 * Breadcrumb visual component. JSON-LD BreadcrumbList is emitted separately
 * by the parent page via `buildBreadcrumbSchema()` + `<JsonLd>` so SEO and
 * display stay decoupled.
 */
export function Breadcrumb({ items, variant = "default", className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  // Apply text color directly to each leaf element so we don't rely on
  // anchor-link color inheritance, which can fail when a parent stylesheet
  // sets `a { color: ... }` (e.g. some preflight setups) — making breadcrumb
  // links render as the body color even though the parent is `text-white`.
  const linkTextColor =
    variant === "light" ? "text-white" : "text-[color:var(--color-muted)]";
  const activeTextColor =
    variant === "light" ? "text-white" : "text-[color:var(--color-heading)]";
  const hoverColor =
    variant === "light"
      ? "hover:opacity-80"
      : "hover:text-[color:var(--color-primary)]";

  // Force pure-white explicitly via inline style for the light variant.
  // Tailwind's `text-white` should already do this, but a stale dev cache or
  // an unexpected cascade can leave the link looking dim — inline style has
  // top specificity so the user sees pure #fff regardless.
  const lightInlineStyle =
    variant === "light" ? ({ color: "#ffffff" } as const) : undefined;

  return (
    <nav aria-label="ลำดับเส้นทาง" className={className}>
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs font-medium md:text-sm ${linkTextColor}`}
        style={lightInlineStyle}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index === 0 && (
                <Home
                  aria-hidden
                  className={`size-3.5 shrink-0 ${linkTextColor}`}
                  style={lightInlineStyle}
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`${linkTextColor} transition-colors ${hoverColor}`}
                  style={lightInlineStyle}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? `font-semibold ${activeTextColor}` : linkTextColor
                  }
                  style={lightInlineStyle}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  aria-hidden
                  className={`size-3.5 shrink-0 ${linkTextColor}`}
                  style={lightInlineStyle}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

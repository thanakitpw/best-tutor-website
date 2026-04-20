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

  const textColor =
    variant === "light"
      ? "text-white/80"
      : "text-[color:var(--color-muted)]";
  const activeColor = variant === "light" ? "text-white" : "text-[color:var(--color-heading)]";
  const hoverColor =
    variant === "light"
      ? "hover:text-white"
      : "hover:text-[color:var(--color-primary)]";

  return (
    <nav aria-label="ลำดับเส้นทาง" className={className}>
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs md:text-sm ${textColor}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index === 0 && (
                <Home aria-hidden className="size-3.5 shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`transition-colors ${hoverColor}`}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={`${isLast ? `font-medium ${activeColor}` : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-60" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

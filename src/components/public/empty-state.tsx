import Link from "next/link";
import { SearchX, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Headline — keep short, friendly, action-oriented. */
  title: string;
  /** Secondary helper sentence — can contain a CTA hint. */
  description?: string;
  /** Optional lucide icon. Defaults to SearchX. */
  icon?: LucideIcon;
  /** Primary action (optional). */
  action?: {
    href: string;
    label: string;
  };
  /** Secondary action (optional). */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Generic empty state — used by tutor listings ("no tutors match filter"),
 * blog search, review galleries, etc. Keeps visual language consistent.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)] px-6 py-12 text-center",
        className ?? "",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-white text-[color:var(--color-primary)] shadow-sm"
      >
        <Icon className="size-7" />
      </span>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-[color:var(--color-heading)]">
          {title}
        </h3>
        {description && (
          <p className="max-w-md text-sm leading-6 text-[color:var(--color-muted)]">
            {description}
          </p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button asChild size="sm">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

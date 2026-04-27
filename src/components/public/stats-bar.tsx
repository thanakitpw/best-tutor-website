import { CheckCircle2 } from "lucide-react";

interface StatsBarItem {
  label: string;
  value: string;
}

interface StatsBarProps {
  items?: readonly StatsBarItem[];
  /** Use "light" on dark backgrounds (hero) — switches text to white */
  variant?: "default" | "light";
  className?: string;
}

const DEFAULT_ITEMS: readonly StatsBarItem[] = [
  { value: "50,000+", label: "ลูกค้าที่ไว้วางใจ" },
  { value: "500+", label: "ติวเตอร์คุณภาพ" },
  { value: "100+", label: "องค์กรคู่ค้า" },
];

/**
 * Trust-signal stats bar. Surfaces social proof above the fold.
 * `variant="light"` is intended for the homepage hero overlay.
 */
export function StatsBar({
  items = DEFAULT_ITEMS,
  variant = "default",
  className,
}: StatsBarProps) {
  const textColor = variant === "light" ? "text-white" : "text-[color:var(--color-heading)]";
  const mutedColor =
    variant === "light" ? "text-white/70" : "text-[color:var(--color-muted)]";
  const iconColor =
    variant === "light" ? "text-[color:var(--color-cta)]" : "text-[color:var(--color-success)]";

  return (
    <ul
      className={[
        "flex flex-wrap items-center gap-x-6 gap-y-3",
        className ?? "",
      ].join(" ")}
      aria-label="สถิติการใช้งาน"
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <CheckCircle2 className={`size-4 ${iconColor}`} aria-hidden />
          <span className={`text-sm font-semibold ${textColor} md:text-base`}>
            {item.value}
          </span>
          <span className={`text-xs font-medium ${mutedColor} md:text-sm`}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

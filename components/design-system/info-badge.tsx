import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type InfoBadgeProps = {
  icon: IconSvgElement;
  label: string;
  className?: string;
};

/** Icon + value pill used for compact metadata rows (latency, model, cost, etc). */
export function InfoBadge({ icon, label, className }: InfoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground",
        className
      )}
    >
      <HugeiconsIcon icon={icon} size={13} strokeWidth={1.5} className="shrink-0" />
      <span className="font-mono tabular-nums text-foreground">{label}</span>
    </span>
  );
}

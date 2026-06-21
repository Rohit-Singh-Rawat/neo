import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type InfoBadgeProps = {
  icon: IconSvgElement;
  label: string;
  className?: string;
};

/** Icon + monospace-value `Badge` composition for compact metadata rows (latency, model, cost, etc). */
export function InfoBadge({ icon, label, className }: InfoBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("h-auto gap-1.5 rounded-md bg-muted py-1 text-muted-foreground", className)}
    >
      <HugeiconsIcon icon={icon} size={13} strokeWidth={1.5} className="shrink-0" />
      <span className="font-mono tabular-nums text-foreground">{label}</span>
    </Badge>
  );
}

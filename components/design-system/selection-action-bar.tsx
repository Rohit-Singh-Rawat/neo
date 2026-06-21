import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

type SelectionActionBarProps = {
  count: number;
  onClear: () => void;
  children?: React.ReactNode;
};

/** Floating pill bar showing the current row-selection count and bulk actions. */
export function SelectionActionBar({ count, onClear, children }: SelectionActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center gap-1 rounded-full border border-border/50 dark:border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-md ring-1 ring-black/5">
        <span className="px-3 text-sm font-medium text-foreground">
          {count} selected
        </span>
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={onClear}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>
    </div>
  );
}

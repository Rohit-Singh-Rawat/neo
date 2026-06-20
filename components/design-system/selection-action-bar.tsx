import { Button } from "@/components/ui/button";

type SelectionAction = {
  label: string;
  onAction: () => void;
};

type SelectionActionBarProps = {
  count: number;
  onClear: () => void;
  actions: SelectionAction[];
};

/** Bottom bar showing the current row-selection count and bulk actions for any list with checkboxes. */
export function SelectionActionBar({ count, onClear, actions }: SelectionActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 border-t border-border bg-card px-4 py-2 text-sm">
      <span className="text-muted-foreground">{count} selected</span>
      {actions.map((action) => (
        <Button key={action.label} variant="secondary" size="sm" onClick={action.onAction}>
          {action.label}
        </Button>
      ))}
      <Button variant="ghost" size="sm" className="ml-auto" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}

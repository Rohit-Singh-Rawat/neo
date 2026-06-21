"use client";

import type { KnownActionElement } from "@/lib/data/slack-schemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSlackAction } from "../slack-action-context";

type StaticSelectElementData = Extract<KnownActionElement, { type: "static_select" }>;

export function StaticSelectElement({ element }: { element: StaticSelectElementData }) {
  const { mergeStrategy, dispatch } = useSlackAction();

  return (
    <Select
      value={mergeStrategy ?? undefined}
      onValueChange={(value) => {
        // Base UI's onValueChange types `value` as `string | null` for single-select;
        // null only fires on programmatic clear, which this dispatch has no case for.
        if (value !== null) dispatch({ type: "SELECT_MERGE_STRATEGY", value });
      }}
    >
      <SelectTrigger
        size="sm"
        className="h-auto rounded-[4px] border-[var(--slack-button-border)] bg-[var(--slack-button-bg)] px-3 py-1.5 text-[13px] text-[var(--slack-button-text)] hover:bg-[var(--slack-button-bg)]"
      >
        <SelectValue placeholder={element.placeholder.text} />
      </SelectTrigger>
      <SelectContent>
        {element.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.text.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

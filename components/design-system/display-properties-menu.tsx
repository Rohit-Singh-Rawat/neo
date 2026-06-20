"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, ArrowUpDownIcon, SortDescendingIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ColumnDef<T extends string> = {
  key: T;
  label: string;
};

type DisplayPropertiesMenuProps<T extends string> = {
  columns: ColumnDef<T>[];
  visible: T[];
  onToggle: (key: T, visible: boolean) => void;
  onReset?: () => void;
  
  sortValue?: string;
  onSortChange?: (value: string | null) => void;
  sortOptions?: { value: string; label: string }[];

  groupValue?: string;
  onGroupChange?: (value: string | null) => void;
  groupOptions?: { value: string; label: string }[];
};

export function DisplayPropertiesMenu<T extends string>({
  columns,
  visible,
  onToggle,
  onReset,
  sortValue,
  onSortChange,
  sortOptions,
  groupValue,
  onGroupChange,
  groupOptions,
}: DisplayPropertiesMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="rounded-full border-border/50 bg-background hover:bg-muted/50" />}>
        <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={1.5} size={16} />
        <span className="sr-only">View options</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px] p-0">
        <div className="flex flex-col gap-5 p-4">
          <div className="grid grid-cols-[1fr_auto_100px] items-center gap-y-4 text-sm">
            {groupOptions && groupOptions.length > 0 && (
              <>
                <span className="text-muted-foreground text-xs">Grouping</span>
                <HugeiconsIcon icon={ArrowUpDownIcon} size={14} className="mx-2 text-muted-foreground" />
                <Select value={groupValue} onValueChange={onGroupChange}>
                  <SelectTrigger size="sm" className="h-7 w-full justify-between px-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1">
                    {groupOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs py-1.5">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {sortOptions && sortOptions.length > 0 && (
              <>
                <span className="text-muted-foreground text-xs">Ordering</span>
                <HugeiconsIcon icon={SortDescendingIcon} size={14} className="mx-2 text-muted-foreground" />
                <Select value={sortValue} onValueChange={onSortChange}>
                  <SelectTrigger size="sm" className="h-7 w-full justify-between px-2 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1">
                    {sortOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs py-1.5">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          
          <div>
            <div className="text-muted-foreground text-xs font-medium mb-3">Display properties</div>
            <div className="flex flex-wrap gap-2">
              {columns.map(col => (
                <button
                  key={col.key}
                  type="button"
                  className={cn(
                    "flex h-6 items-center px-2 rounded-full text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border",
                    visible.includes(col.key) 
                      ? "bg-accent/80 border-border/80 text-foreground shadow-xs font-medium" 
                      : "bg-transparent border-border/50 text-muted-foreground hover:bg-muted/40"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle(col.key, !visible.includes(col.key));
                  }}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 py-1 px-2 flex justify-between items-center text-xs bg-muted/10">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground font-medium w-full" onClick={onReset}>
            Reset
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

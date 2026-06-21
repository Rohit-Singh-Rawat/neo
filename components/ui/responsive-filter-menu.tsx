"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkSquare02Icon, Square01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface FilterGroupBase {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  badge?: number | string;
}

export type FilterGroup =
  | (FilterGroupBase & { type: "radio"; value: string; onChange: (value: string) => void })
  | (FilterGroupBase & { type: "checkbox"; value: string[]; onChange: (value: string[]) => void });

export interface ResponsiveFilterMenuProps {
  trigger: React.ReactNode;
  title: string;
  groups: FilterGroup[];
  activeFilterCount?: number;
  onClearAll?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Renders a set of filter groups as nested flyouts on desktop (DropdownMenu)
 * and as a unified stacked view on mobile (Drawer).
 */
export function ResponsiveFilterMenu({
  trigger,
  title,
  groups,
  activeFilterCount = 0,
  onClearAll,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ResponsiveFilterMenuProps) {
  const isMobile = useIsMobile();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-border/50 dark:border-border text-left">
            <DrawerTitle className="text-base">{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-2 flex flex-col gap-6">
            {groups.map((group) => (
              <div key={group.id} className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {group.icon}
                  {group.label}
                  {group.badge !== undefined && group.badge !== 0 && group.badge !== "" && (
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                      {group.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {group.options.map((opt) => {
                    const isSelected =
                      group.type === "radio"
                        ? group.value === opt.value
                        : group.value.includes(opt.value);

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          if (group.type === "radio") {
                            group.onChange(opt.value);
                          } else if (isSelected) {
                            group.onChange(group.value.filter((v) => v !== opt.value));
                          } else {
                            group.onChange([...group.value, opt.value]);
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-left transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {group.type === "checkbox" ? (
                          <HugeiconsIcon
                            icon={isSelected ? CheckmarkSquare02Icon : Square01Icon}
                            size={16}
                            strokeWidth={1.5}
                            className={isSelected ? "text-primary" : "text-muted-foreground"}
                          />
                        ) : (
                          <div
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border",
                              isSelected ? "border-primary" : "border-muted-foreground/50"
                            )}
                          >
                            {isSelected && <div className="size-2 rounded-full bg-primary" />}
                          </div>
                        )}
                        {opt.icon}
                        <span className="flex-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {activeFilterCount > 0 && onClearAll && (
              <div className="border-t border-border/50 dark:border-border pt-4 pb-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onClearAll();
                    setOpen(false);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={trigger as React.ReactElement} />
      <DropdownMenuContent align="end" className="w-[220px] p-0">
        <div className="flex items-center justify-between border-b border-border/50 dark:border-border px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium">{title}</span>
        </div>

        <div className="p-1">
          {groups.map((group) => (
            <DropdownMenuSub key={group.id}>
              <DropdownMenuSubTrigger className="text-xs">
                {group.icon && <span className="mr-2 text-muted-foreground">{group.icon}</span>}
                <span className="flex-1">{group.label}</span>
                {group.badge !== undefined && group.badge !== 0 && group.badge !== "" && (
                  <span className="ml-2 max-w-[70px] truncate rounded-full border border-border/50 dark:border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                    {group.badge}
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[200px]">
                {group.type === "radio" ? (
                  <DropdownMenuRadioGroup
                    value={group.value}
                    onValueChange={group.onChange}
                  >
                    {group.options.map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-xs flex items-center gap-2">
                        {opt.icon}
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                ) : (
                  <>
                    {group.options.map((opt) => {
                      const isSelected = group.value.includes(opt.value);
                      return (
                        <DropdownMenuCheckboxItem
                          key={opt.value}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              group.onChange([...group.value, opt.value]);
                            } else {
                              group.onChange(group.value.filter((v) => v !== opt.value));
                            }
                          }}
                          className="pr-2 pl-1.5 text-xs"
                        >
                          {opt.icon}
                          <span className="flex-1 text-left">{opt.label}</span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </div>

        {activeFilterCount > 0 && onClearAll && (
          <div className="border-t border-border/50 dark:border-border px-3 py-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClearAll();
                setOpen(false);
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

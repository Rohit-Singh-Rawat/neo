"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon, KanbanIcon, DashboardSquare01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setOpen(true)}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent"
          aria-label="Search"
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Search <kbd className="ml-1 text-[10px] text-muted-foreground">⌘K</kbd>
        </TooltipContent>
      </Tooltip>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Issues">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/issues"))}
            >
              <HugeiconsIcon icon={KanbanIcon} />
              <span>Go to issues</span>
              <CommandShortcut>I</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          
          <CommandGroup heading="Traces">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/traces"))}
            >
              <HugeiconsIcon icon={Activity01Icon} />
              <span>View active traces</span>
              <CommandShortcut>T</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Dashboard">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} />
              <span>Open dashboard</span>
              <CommandShortcut>D</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          
        </CommandList>
      </CommandDialog>
    </>
  );
}

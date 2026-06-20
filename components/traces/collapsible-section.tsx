"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function CollapsibleSection({ title, defaultOpen = true, children, className }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("flex flex-col", className)}>
      <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          strokeWidth={2}
          className={cn("shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90")}
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 overflow-hidden">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResizableSidebar } from "@/components/layout/resizable-sidebar";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SpanView } from "@/components/traces/span-explorer";

interface TraceDetailLayoutProps {
  hasSpanParam: boolean;
  explorer: React.ReactNode;
  detail: React.ReactNode;
  defaultSidebarWidth: number;
  view: SpanView;
}

export function TraceDetailLayout({
  hasSpanParam,
  explorer,
  detail,
  defaultSidebarWidth,
  view,
}: TraceDetailLayoutProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // User swiped down to close the drawer, clear the span param
      const params = new URLSearchParams(searchParams.toString());
      params.delete("span");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-1 w-full overflow-hidden">
        {explorer}
        <Drawer open={hasSpanParam} onOpenChange={handleOpenChange}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerTitle className="sr-only">Span Details</DrawerTitle>
            <ScrollArea className="overflow-y-auto h-full w-full">
              {detail}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <ResizableSidebar
        key={view}
        defaultWidth={defaultSidebarWidth}
        className="border-r border-border"
      >
        {explorer}
      </ResizableSidebar>
      <div className="flex-1 min-w-0 overflow-y-auto">
        {detail}
      </div>
    </div>
  );
}

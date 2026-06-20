"use client";

import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { BarChartHorizontalIcon, HierarchySquare01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { Span } from "@/lib/data/schemas";
import { SpanTree } from "./span-tree";
import { SpanWaterfall } from "./span-waterfall";

export type SpanView = "tree" | "waterfall";

type SpanExplorerProps = {
  spans: Span[];
  selectedSpanId: string;
  view: SpanView;
};

export function SpanExplorer({ spans, selectedSpanId, view }: SpanExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(next: { span?: string; view?: SpanView }) {
    const params = new URLSearchParams();
    const span = next.span ?? selectedSpanId;
    const nextView = next.view ?? view;
    params.set("span", span);
    if (nextView !== "tree") params.set("view", nextView);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-border p-2">
        <Button variant={view === "tree" ? "secondary" : "ghost"} size="sm" onClick={() => navigate({ view: "tree" })}>
          <HugeiconsIcon icon={HierarchySquare01Icon} data-icon="inline-start" />
          Tree
        </Button>
        <Button
          variant={view === "waterfall" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate({ view: "waterfall" })}
        >
          <HugeiconsIcon icon={BarChartHorizontalIcon} data-icon="inline-start" />
          Waterfall
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {view === "tree" ? (
          <SpanTree spans={spans} selectedSpanId={selectedSpanId} onSelectSpan={(id) => navigate({ span: id })} />
        ) : (
          <SpanWaterfall spans={spans} selectedSpanId={selectedSpanId} onSelectSpan={(id) => navigate({ span: id })} />
        )}
      </div>
    </div>
  );
}

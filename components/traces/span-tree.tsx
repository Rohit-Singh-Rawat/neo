"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { formatCurrency, formatDuration } from "@/lib/format";
import { buildChildrenMap, handleSpanArrowKeys, spanTypeIcon } from "@/lib/spans";
import { StatusIndicator } from "@/components/design-system/status-indicator";
import { cn } from "@/lib/utils";
import type { Span } from "@/lib/data/schemas";

const GUIDE_OFFSET = 20;

type FlatSpan = {
  span: Span;
  depth: number;
  isLast: boolean;
  ancestorsIsLast: boolean[];
};

function getVisibleSpans(
  roots: Span[],
  childrenByParent: Map<string | null, Span[]>,
  collapsedIds: Set<string>
): FlatSpan[] {
  const result: FlatSpan[] = [];

  function traverse(node: Span, depth: number, ancestorsIsLast: boolean[], isLast: boolean) {
    result.push({ span: node, depth, isLast, ancestorsIsLast });
    if (!collapsedIds.has(node.id)) {
      const children = childrenByParent.get(node.id) ?? [];
      children.forEach((child, index) => {
        traverse(child, depth + 1, [...ancestorsIsLast, isLast], index === children.length - 1);
      });
    }
  }

  roots.forEach((root, index) => {
    traverse(root, 0, [], index === roots.length - 1);
  });

  return result;
}


type SpanTreeProps = {
  spans: Span[];
  selectedSpanId: string;
  onSelectSpan: (spanId: string) => void;
};

export function SpanTree({ spans, selectedSpanId, onSelectSpan }: SpanTreeProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const rowRefs = useRef<Map<string, HTMLDivElement> | null>(null);
  if (rowRefs.current === null) rowRefs.current = new Map();
  const hasMounted = useRef(false);

  // Keyboard-driven selection (arrow keys) moves `selectedSpanId` but never touches the
  // DOM directly, so without this the visible focus ring stays on whatever was last
  // clicked/tabbed-to while the "selected" row moves elsewhere. Skip the first run so
  // mounting the tree doesn't steal focus from wherever the page already put it.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    rowRefs.current!.get(selectedSpanId)?.focus();
  }, [selectedSpanId]);

  const { childrenByParent, roots, visibleSpans } = useMemo(() => {
    const map = buildChildrenMap(spans);
    const rootSpans = map.get(null) ?? [];
    return {
      childrenByParent: map,
      roots: rootSpans,
      visibleSpans: getVisibleSpans(rootSpans, map, collapsedIds),
    };
  }, [spans, collapsedIds]);

  function handleKeyDown(event: React.KeyboardEvent) {
    // We pass the visible spans so up/down arrow only navigates visible items
    handleSpanArrowKeys(
      event,
      visibleSpans.map((fs) => fs.span),
      selectedSpanId,
      onSelectSpan
    );
  }

  function toggleCollapse(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div
      role="tree"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col outline-none"
      aria-label="Span tree"
    >
      {visibleSpans.map(({ span, depth, isLast, ancestorsIsLast }) => {
        const isSelected = span.id === selectedSpanId;
        const isCollapsed = collapsedIds.has(span.id);
        const hasChildren = (childrenByParent.get(span.id) ?? []).length > 0;
        const Icon = spanTypeIcon[span.type];

        return (
          <div key={span.id} className="relative flex min-h-[36px] w-full items-stretch group/node">
            {/* The tree guide lines section */}
            <div className="flex shrink-0">
              {/* Ancestor lines */}
              {ancestorsIsLast.map((isAncestorLast, i) => (
                <div key={i} className="relative shrink-0" style={{ width: GUIDE_OFFSET }}>
                  {!isAncestorLast && (
                    <div className="absolute inset-y-0 left-1/2 -ml-[0.5px] w-px bg-border" />
                  )}
                </div>
              ))}

              {/* Current depth connector */}
              {depth > 0 && (
                <div className="relative shrink-0" style={{ width: GUIDE_OFFSET }}>
                  {/* The curved L-shape connector */}
                  <div
                    className="absolute left-1/2 top-0 -ml-[0.5px] w-1/2 rounded-bl-[8px] border-b border-l border-border"
                    style={{ height: "18px" }} // Half of min-h-[36px] to hit the vertical center
                  />
                  {/* The continuous vertical line (only if not the last child) */}
                  {!isLast && (
                    <div className="absolute inset-y-0 left-1/2 -ml-[0.5px] w-px bg-border" />
                  )}
                </div>
              )}
            </div>

            {/* Row Content (padded so there's visual gap between rows without breaking lines) */}
            <div className="flex flex-1 flex-col py-0.5 min-w-0">
              <div
                ref={(el) => {
                  if (el) rowRefs.current!.set(span.id, el);
                  else rowRefs.current!.delete(span.id);
                }}
                role="treeitem"
                aria-selected={isSelected}
                aria-expanded={hasChildren ? !isCollapsed : undefined}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectSpan(span.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSpan(span.id);
                  }
                }}
                className={cn(
                  "flex h-[32px] w-full cursor-pointer items-center rounded-md pr-2 text-left text-sm transition-colors bg-muted hover:bg-accent focus-visible:bg-accent focus-visible:outline-none",
                  isSelected && "bg-accent",
                  !isSelected && span.status === "error" && "bg-destructive/10 hover:bg-destructive/20"
                )}
              >
                {/* Collapse toggle */}
                <div className="relative flex w-5 shrink-0 items-center justify-center">
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleCollapse(e, span.id)}
                      aria-label={isCollapsed ? "Expand" : "Collapse"}
                      className="flex size-4 shrink-0 items-center justify-center rounded-sm hover:bg-muted/50"
                    >
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={12}
                        strokeWidth={2}
                        className={cn("text-muted-foreground transition-transform", !isCollapsed && "rotate-90")}
                      />
                    </button>
                  )}
                </div>

                <HugeiconsIcon icon={Icon} size={14} strokeWidth={1.5} className="mr-2 shrink-0 text-muted-foreground" />
                <StatusIndicator status={span.status} className="mr-2 [&>svg]:size-[12px]" />
                <span className="min-w-0 truncate">{span.name}</span>
                {span.type === "llm" && span.model && (
                  <span className="ml-2 shrink-0 truncate font-mono text-[10px] text-muted-foreground">{span.model}</span>
                )}
                <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {span.type === "llm" && span.costUsd !== undefined && <span>{formatCurrency(span.costUsd)}</span>}
                  <span>{span.latencyMs ? formatDuration(span.latencyMs) : ""}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

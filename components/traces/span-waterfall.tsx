"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatCurrency, formatDuration } from "@/lib/format";
import {
  buildChildrenMap,
  estimateLabelWidth,
  flattenTree,
  getLabelPlacement,
  getTraceTimeBounds,
  handleSpanArrowKeys,
  OUTSIDE_LABEL_GAP,
  spanTypeIcon,
} from "@/lib/spans";
import { useFocusSelectedRow } from "@/hooks/use-focus-selected-row";
import { cn } from "@/lib/utils";
import type { Span } from "@/lib/data/schemas";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Horizontal padding (px) on each side of the timeline area inside the row */
const ROW_PADDING_PX = 8;

/** Minimum container width before horizontal scroll kicks in */
const MIN_WIDTH_PX = 520;

// ─── Colour maps ──────────────────────────────────────────────────────────────

const barBg: Record<Span["status"], string> = {
  success: "bg-success/20",
  error:   "bg-destructive/20",
  running: "bg-running/20",
};

/** Label text is always default — only the bar bg is status-colored */
const labelColor: Record<Span["status"], string> = {
  success: "text-foreground",
  error:   "text-foreground",
  running: "text-foreground",
};

// ─── Component ────────────────────────────────────────────────────────────────

type SpanWaterfallProps = {
  spans: Span[];
  selectedSpanId: string;
  onSelectSpan: (spanId: string) => void;
};

export function SpanWaterfall({ spans, selectedSpanId, onSelectSpan }: SpanWaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLElement> | null>(null);
  if (rowRefs.current === null) rowRefs.current = new Map();
  const [timelineWidthPx, setTimelineWidthPx] = useState(480);

  useFocusSelectedRow(selectedSpanId, rowRefs);

  // Track the actual pixel width of the inner timeline area so we can
  // calculate label placements without DOM measurement per-label.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setTimelineWidthPx(Math.max(el.offsetWidth - ROW_PADDING_PX * 2, 1));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { flatSpans, bounds, totalMs } = useMemo(() => {
    const map = buildChildrenMap(spans);
    const roots = map.get(null) ?? [];
    const b = getTraceTimeBounds(spans);
    return { flatSpans: flattenTree(roots, map), bounds: b, totalMs: b.end - b.start };
  }, [spans]);

  function handleKeyDown(e: React.KeyboardEvent) {
    handleSpanArrowKeys(e, flatSpans.map((f) => f.span), selectedSpanId, onSelectSpan);
  }

  return (
    <div className="w-full overflow-x-auto">
      <div ref={containerRef} style={{ minWidth: MIN_WIDTH_PX }}>

        {/* Tick ruler */}
        <div
          className="mb-1 flex justify-between font-mono text-[10px] text-muted-foreground select-none"
          style={{ paddingInline: ROW_PADDING_PX }}
        >
          <span>0ms</span>
          <span>{formatDuration(totalMs / 2)}</span>
          <span>{formatDuration(totalMs)}</span>
        </div>

        {/* Rows */}
        <div
          role="tree"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex flex-col gap-0.5 outline-none"
          aria-label="Span waterfall"
        >
          {flatSpans.map(({ span }) => {
            const isSelected = span.id === selectedSpanId;
            const Icon = spanTypeIcon[span.type];

            const spanStart = Date.parse(span.startTime);
            const spanEnd = span.endTime ? Date.parse(span.endTime) : bounds.end;

            const offsetPct = ((spanStart - bounds.start) / totalMs) * 100;
            const widthPct  = Math.max(((spanEnd - spanStart) / totalMs) * 100, 0.5);

            // Actual pixel positions within the inner timeline area
            const barLeftPx  = (offsetPct / 100) * timelineWidthPx;
            const barWidthPx = (widthPct  / 100) * timelineWidthPx;
            const labelWidth = estimateLabelWidth(span);
            const placement  = getLabelPlacement(barLeftPx, barWidthPx, timelineWidthPx, labelWidth);

            const labelContent = (
              <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                <HugeiconsIcon
                  icon={Icon}
                  size={13}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground"
                />
                <span className={cn("font-medium text-sm truncate", labelColor[span.status])}>
                  {span.name}
                </span>
                {span.latencyMs && (
                  <span className="tabular-nums text-xs text-muted-foreground shrink-0">
                    {formatDuration(span.latencyMs)}
                  </span>
                )}
                {span.type === "llm" && span.model && (
                  <span className="font-mono text-[10px] text-muted-foreground/70 shrink-0">
                    {span.model}
                  </span>
                )}
                {span.type === "llm" && span.costUsd !== undefined && (
                  <span className="tabular-nums text-[10px] text-muted-foreground/70 shrink-0">
                    {formatCurrency(span.costUsd)}
                  </span>
                )}
              </div>
            );

            return (
              <button
                key={span.id}
                ref={(el) => {
                  if (el) rowRefs.current!.set(span.id, el);
                  else rowRefs.current!.delete(span.id);
                }}
                type="button"
                role="treeitem"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectSpan(span.id)}
                className={cn(
                  "relative h-[36px] w-full rounded-md transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isSelected ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                {/*
                 * Inner coordinate space — inset by ROW_PADDING_PX on each side.
                 * All percentage-based positions below are relative to this div.
                 */}
                <div
                  className="absolute inset-y-[5px]"
                  style={{ left: ROW_PADDING_PX, right: ROW_PADDING_PX }}
                >
                  {/* ── The coloured bar pill ─────────────────────────────── */}
                  <div
                    className={cn(
                      "absolute inset-y-0 rounded-sm",
                      barBg[span.status],
                      // overflow-hidden only when label is inside so it clips cleanly
                      placement === "inside" && "overflow-hidden flex items-center"
                    )}
                    style={{ left: `${offsetPct}%`, width: `${widthPct}%` }}
                  >
                    {placement === "inside" && (
                      <div className="px-2">{labelContent}</div>
                    )}
                  </div>

                  {/* ── Label to the RIGHT of the bar ────────────────────── */}
                  {placement === "right" && (
                    <div
                      className="absolute inset-y-0 flex items-center"
                      style={{ left: `calc(${offsetPct}% + ${barWidthPx + OUTSIDE_LABEL_GAP}px)` }}
                    >
                      {labelContent}
                    </div>
                  )}

                  {/* ── Label to the LEFT of the bar ─────────────────────── */}
                  {placement === "left" && (
                    <div
                      className="absolute inset-y-0 flex items-center justify-end"
                      style={{ right: `calc(${100 - offsetPct}% + ${OUTSIDE_LABEL_GAP}px)`, left: 0 }}
                    >
                      {labelContent}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

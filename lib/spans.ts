import { BrainIcon, FunctionIcon, GitBranchIcon, Search01Icon, Shield01Icon, Wrench01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { KeyboardEvent } from "react";
import type { Span } from "@/lib/data/schemas";
import { formatCurrency, formatDuration } from "@/lib/format";

export const spanTypeIcon: Record<Span["type"], IconSvgElement> = {
  chain: GitBranchIcon,
  tool: Wrench01Icon,
  llm: BrainIcon,
  retriever: Search01Icon,
  parser: FunctionIcon,
  guardrail: Shield01Icon,
};

export function buildChildrenMap(spans: Span[]): Map<string | null, Span[]> {
  const map = new Map<string | null, Span[]>();
  for (const span of spans) {
    const siblings = map.get(span.parentId) ?? [];
    siblings.push(span);
    map.set(span.parentId, siblings);
  }
  for (const siblings of map.values()) {
    siblings.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
  }
  return map;
}

export type TraceTimeBounds = { start: number; end: number };

export function getTraceTimeBounds(spans: Span[]): TraceTimeBounds {
  const starts = spans.map((span) => Date.parse(span.startTime));
  const ends = spans.map((span) => (span.endTime ? Date.parse(span.endTime) : Date.parse(span.startTime)));
  const start = Math.min(...starts);
  const end = Math.max(...ends, start + 1);
  return { start, end };
}

export function handleSpanArrowKeys(
  event: KeyboardEvent,
  orderedSpans: Span[],
  selectedSpanId: string,
  onSelectSpan: (spanId: string) => void
): void {
  const currentIndex = orderedSpans.findIndex((span) => span.id === selectedSpanId);
  if (event.key === "ArrowDown") {
    event.preventDefault();
    const next = orderedSpans[Math.min(currentIndex + 1, orderedSpans.length - 1)];
    if (next) onSelectSpan(next.id);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const prev = orderedSpans[Math.max(currentIndex - 1, 0)];
    if (prev) onSelectSpan(prev.id);
  } else if (event.key === "Home") {
    // APG tree view pattern: Home/End jump to the first/last visible row.
    event.preventDefault();
    const first = orderedSpans[0];
    if (first) onSelectSpan(first.id);
  } else if (event.key === "End") {
    event.preventDefault();
    const last = orderedSpans[orderedSpans.length - 1];
    if (last) onSelectSpan(last.id);
  }
}

// ─── Waterfall layout math ──────────────────────────────────────────────────
// Pure geometry helpers for the span waterfall view, kept here (not in the
// component) so they're testable in isolation and colocated with the rest of
// the span-tree logic.

/** Estimated average character width in px at text-sm (14px) font, used to
 *  estimate label width without DOM measurement. */
const AVG_CHAR_WIDTH = 7.2;

/** Padding inside the bar (left+right) when a label is placed inside it. */
const BAR_LABEL_PADDING = 16;

/** Gap between the bar edge and an outside label — also used by the waterfall
 *  component itself to position the label element once placement is decided. */
export const OUTSIDE_LABEL_GAP = 6;

export type FlatSpan = { span: Span };

export function flattenTree(roots: Span[], byParent: Map<string | null, Span[]>): FlatSpan[] {
  const result: FlatSpan[] = [];
  function walk(node: Span) {
    result.push({ span: node });
    for (const child of byParent.get(node.id) ?? []) walk(child);
  }
  roots.forEach(walk);
  return result;
}

/** Estimates the rendered pixel width of a span label: icon (~14px) + gap (6px) + text characters. */
export function estimateLabelWidth(span: Span): number {
  const namePx = span.name.length * AVG_CHAR_WIDTH;
  const durationPx = span.latencyMs ? formatDuration(span.latencyMs).length * AVG_CHAR_WIDTH + 4 : 0;
  const modelPx = span.type === "llm" && span.model ? span.model.length * AVG_CHAR_WIDTH * 0.75 + 4 : 0;
  const costPx = span.type === "llm" && span.costUsd !== undefined
    ? formatCurrency(span.costUsd).length * AVG_CHAR_WIDTH * 0.75 + 4
    : 0;
  return 14 + 6 + namePx + durationPx + modelPx + costPx;
}

export type LabelPlacement = "inside" | "right" | "left";

/**
 * Decides where to render a waterfall bar's label, in priority order:
 *   1. "inside"  — bar is wide enough to hold the label with padding
 *   2. "right"   — there is enough space to the right of the bar
 *   3. "left"    — fall back to left (always has some space for the root span)
 */
export function getLabelPlacement(
  barLeftPx: number,
  barWidthPx: number,
  timelineWidthPx: number,
  labelWidthPx: number
): LabelPlacement {
  if (barWidthPx >= labelWidthPx + BAR_LABEL_PADDING) return "inside";
  const spaceRight = timelineWidthPx - barLeftPx - barWidthPx;
  if (spaceRight >= labelWidthPx + OUTSIDE_LABEL_GAP) return "right";
  return "left";
}

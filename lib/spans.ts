import { BrainIcon, FunctionIcon, GitBranchIcon, Search01Icon, Shield01Icon, Wrench01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { KeyboardEvent } from "react";
import type { Span } from "@/lib/data/schemas";

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

export function flattenDepthFirst(childrenByParent: Map<string | null, Span[]>): Span[] {
  const result: Span[] = [];
  function visit(parentId: string | null) {
    for (const child of childrenByParent.get(parentId) ?? []) {
      result.push(child);
      visit(child.id);
    }
  }
  visit(null);
  return result;
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
  }
}

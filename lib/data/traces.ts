import rawData from "@/data/traces.json";
import { TracesFileSchema, type Trace } from "./schemas";

const parsed = TracesFileSchema.parse(rawData);
const traceList: readonly Trace[] = parsed.traces;
const traceById = new Map<string, Trace>(traceList.map((trace) => [trace.id, trace]));

export function getTraces(): readonly Trace[] {
  return traceList;
}

export function getTraceById(id: string): Trace | undefined {
  return traceById.get(id);
}

export type TraceFilter = {
  query?: string;
  status?: "success" | "error" | "running";
  model?: string;
  tags?: string[];
};

export function filterTraces(traces: readonly Trace[], filter: TraceFilter): Trace[] {
  const query = filter.query?.trim().toLowerCase();
  return traces.filter((trace) => {
    if (query && !trace.name.toLowerCase().includes(query)) return false;
    if (filter.status && trace.status !== filter.status) return false;
    if (filter.model) {
      const hasModel = trace.spans.some(
        (span) => span.type === "llm" && span.model === filter.model
      );
      if (!hasModel) return false;
    }
    if (filter.tags && filter.tags.length > 0) {
      const hasAllTags = filter.tags.every((tag) => trace.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    return true;
  });
}

/** Returns all unique LLM model names across all traces. */
export function getUniqueModels(traces: readonly Trace[]): string[] {
  const models = new Set<string>();
  for (const trace of traces) {
    for (const span of trace.spans) {
      if (span.type === "llm" && span.model) models.add(span.model);
    }
  }
  return Array.from(models).sort();
}

/** Returns all unique tag values across all traces. */
export function getUniqueTags(traces: readonly Trace[]): string[] {
  const tags = new Set<string>();
  for (const trace of traces) {
    for (const tag of trace.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export type TraceSort = "newest" | "oldest" | "cost" | "latency";

function rootLatencyMs(trace: Trace): number {
  return trace.spans.find((span) => span.parentId === null)?.latencyMs ?? 0;
}

export function sortTraces(traces: Trace[], sort: TraceSort): Trace[] {
  const sorted = [...traces];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime));
    case "oldest":
      return sorted.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
    case "cost":
      return sorted.sort((a, b) => b.totalCostUsd - a.totalCostUsd);
    case "latency":
      return sorted.sort((a, b) => rootLatencyMs(b) - rootLatencyMs(a));
  }
}

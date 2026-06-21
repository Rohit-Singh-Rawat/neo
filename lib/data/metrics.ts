import { type Trace } from "./schemas";
import { getTraces } from "./traces";
import { formatDuration } from "@/lib/format";

export type DateRange = { from: Date; to: Date };

export type DashboardInterval = "7d" | "15d" | "20d" | "30d" | "6m";

const INTERVAL_DAYS: Record<DashboardInterval, number> = {
  "7d": 7,
  "15d": 15,
  "20d": 20,
  "30d": 30,
  "6m": 182,
};

/** Resolves a dashboard interval value (e.g. from the `range` search param) into a concrete date range ending now. */
export function resolveDashboardInterval(value: string | undefined, now: Date = new Date()): DateRange {
  const days = INTERVAL_DAYS[value as DashboardInterval] ?? INTERVAL_DAYS["15d"];
  const to = now;
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
}

export type DashboardMetrics = {
  totalTraces: number;
  totalCostUsd: number;
  totalTokens: number;
  errorRate: number;
  p50Latency: number;
  p95Latency: number;
  p50Bin: string;
  p95Bin: string;
  latencyHistogram: { bin: string; count: number }[];
  costByModel: { model: string; costUsd: number }[];
  tracesOverTime: { date: string; success: number; error: number; running: number }[];
};

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}

/** Filters traces to those starting within `range`, inclusive of both endpoints. */
export function filterTracesByDateRange(traces: readonly Trace[], range: DateRange): Trace[] {
  const fromMs = range.from.getTime();
  const toMs = range.to.getTime();
  return traces.filter((trace) => {
    const startMs = Date.parse(trace.startTime);
    return startMs >= fromMs && startMs <= toMs;
  });
}

export function computeDashboardMetrics(traces: readonly Trace[] = getTraces(), range?: DateRange): DashboardMetrics {
  const scopedTraces = range ? filterTracesByDateRange(traces, range) : traces;
  return computeMetricsForTraces(scopedTraces);
}

export type PeriodTrendMetrics = {
  totalTraces: number;
  errorRate: number;
  p50Latency: number;
  p95Latency: number;
  totalTokens: number;
  totalCostUsd: number;
};

/**
 * Compares the second half of `traces` against the first half (split by
 * timestamp at the midpoint), so stat tiles can show a real trend instead of
 * a fabricated one. Returns null when there isn't enough of a time spread to
 * make the comparison meaningful.
 */
export function computePeriodTrend(traces: readonly Trace[]): { previous: PeriodTrendMetrics; current: PeriodTrendMetrics } | null {
  if (traces.length < 2) return null;

  const sorted = [...traces].sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint);
  const secondHalf = sorted.slice(midpoint);
  if (firstHalf.length === 0 || secondHalf.length === 0) return null;

  const toPeriodMetrics = (subset: readonly Trace[]): PeriodTrendMetrics => {
    const metrics = computeMetricsForTraces(subset);
    return {
      totalTraces: metrics.totalTraces,
      errorRate: metrics.errorRate,
      p50Latency: metrics.p50Latency,
      p95Latency: metrics.p95Latency,
      totalTokens: metrics.totalTokens,
      totalCostUsd: metrics.totalCostUsd,
    };
  };

  return { previous: toPeriodMetrics(firstHalf), current: toPeriodMetrics(secondHalf) };
}

function computeMetricsForTraces(traces: readonly Trace[]): DashboardMetrics {
  let totalCostUsd = 0;
  let totalTokens = 0;
  let errorCount = 0;
  const latencies: number[] = [];
  const modelCosts = new Map<string, number>();
  
  const tracesOverTimeMap = new Map<string, { success: number; error: number; running: number }>();

  for (const trace of traces) {
    totalCostUsd += trace.totalCostUsd;
    totalTokens += trace.totalTokens;

    if (trace.status === "error") errorCount++;

    const dateStr = trace.startTime.split("T")[0]; // YYYY-MM-DD
    const dayStats = tracesOverTimeMap.get(dateStr) || { success: 0, error: 0, running: 0 };
    dayStats[trace.status]++;
    tracesOverTimeMap.set(dateStr, dayStats);

    const rootSpan = trace.spans.find(s => s.parentId === null);
    if (rootSpan && rootSpan.latencyMs !== undefined) {
        latencies.push(rootSpan.latencyMs);
    }

    for (const span of trace.spans) {
      if (span.type === "llm" && span.model && span.costUsd) {
        const current = modelCosts.get(span.model) || 0;
        modelCosts.set(span.model, current + span.costUsd);
      }
    }
  }

  const p50Latency = percentile(latencies, 50);
  const p95Latency = percentile(latencies, 95);

  const histogram: { bin: string; count: number }[] = [];
  let p50Bin = "";
  let p95Bin = "";

  if (latencies.length > 0) {
    const min = 0;
    // Cap the histogram explicitly at 10 seconds (10,000ms) for logical readable bins
    // Any value > 10s goes into the final overflow bin.
    const max = 10000;
    const binSize = (max - min) / 10;
    
    const bins = new Array(10).fill(0);
    for (const lat of latencies) {
      let binIndex = Math.floor((lat - min) / binSize);
      if (binIndex >= 10) binIndex = 9; // Group all outliers into the last bin
      if (binIndex < 0) binIndex = 0;
      bins[binIndex]++;
    }

    for (let i = 0; i < 10; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const binString = i === 9 ? `>${formatDuration(binStart)}` : `${formatDuration(binStart)}-${formatDuration(binEnd)}`;
      histogram.push({
        bin: binString,
        count: bins[i]
      });

      // Match P50 and P95 to their respective bins
      const p50Index = p50Latency >= max ? 9 : Math.max(0, Math.floor((p50Latency - min) / binSize));
      const p95Index = p95Latency >= max ? 9 : Math.max(0, Math.floor((p95Latency - min) / binSize));
      if (i === p50Index) p50Bin = binString;
      if (i === p95Index) p95Bin = binString;
    }
  }

  const costByModel = Array.from(modelCosts.entries())
    .map(([model, costUsd]) => ({ model, costUsd }))
    .sort((a, b) => b.costUsd - a.costUsd);

  const tracesOverTime = Array.from(tracesOverTimeMap.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalTraces: traces.length,
    totalCostUsd,
    totalTokens,
    errorRate: traces.length > 0 ? (errorCount / traces.length) * 100 : 0,
    p50Latency,
    p95Latency,
    p50Bin,
    p95Bin,
    latencyHistogram: histogram,
    costByModel,
    tracesOverTime,
  };
}

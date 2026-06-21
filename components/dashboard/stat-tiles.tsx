import { type DashboardMetrics, type PeriodTrendMetrics } from "@/lib/data/metrics";
import { MetricCard, type MetricCardProps } from "@/components/design-system/metric-card";
import { formatCurrency, formatDuration, formatTokenCount } from "@/lib/format";

interface StatTilesProps {
  metrics: DashboardMetrics;
  /** First-half vs second-half comparison over the selected range, or null when there's too little data to compare. */
  trend: { previous: PeriodTrendMetrics; current: PeriodTrendMetrics } | null;
}

/** Builds a `MetricCard` trend from a previous/current pair, or omits it when the previous value is zero (a percent change would be meaningless). */
function buildTrend(previous: number, current: number, isGood: (direction: "up" | "down") => boolean, label?: string): MetricCardProps["trend"] {
  if (previous === 0) return undefined;
  const direction = current >= previous ? "up" : "down";
  const percentChange = (Math.abs(current - previous) / previous) * 100;
  return {
    value: percentChange.toFixed(1),
    direction,
    label: label ?? "%",
    isGood: isGood(direction),
  };
}

export function StatTiles({ metrics, trend }: StatTilesProps) {
  const volumeSparkline = metrics.tracesOverTime.map((d) => d.success + d.error + d.running);
  const errorRateSparkline = metrics.tracesOverTime.map((d) => {
    const total = d.success + d.error + d.running;
    return total > 0 ? (d.error / total) * 100 : 0;
  });

  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        title="Total Traces"
        value={metrics.totalTraces.toLocaleString()}
        infoTooltip="Total number of trace executions over the selected period."
        trend={trend ? buildTrend(trend.previous.totalTraces, trend.current.totalTraces, (d) => d === "up") : undefined}
        sparkline={{
          data: volumeSparkline,
        }}
      />

      <MetricCard
        title="Error Rate"
        value={`${metrics.errorRate.toFixed(1)}%`}
        infoTooltip="Percentage of traces that failed with an error status."
        trend={trend ? buildTrend(trend.previous.errorRate, trend.current.errorRate, (d) => d === "down") : undefined}
        sparkline={{
          data: errorRateSparkline,
          color: "var(--destructive)",
        }}
      />

      <MetricCard
        title="P50 Latency"
        value={formatDuration(metrics.p50Latency)}
        infoTooltip="50% of requests complete faster than this duration."
        trend={trend ? buildTrend(trend.previous.p50Latency, trend.current.p50Latency, (d) => d === "down") : undefined}
      />

      <MetricCard
        title="P95 Latency"
        value={formatDuration(metrics.p95Latency)}
        infoTooltip="95% of requests complete faster than this duration."
      />

      <MetricCard
        title="Total Tokens"
        value={formatTokenCount(metrics.totalTokens)}
        infoTooltip="Sum of prompt and completion tokens across all LLM spans."
        trend={trend ? buildTrend(trend.previous.totalTokens, trend.current.totalTokens, (d) => d === "up") : undefined}
      />

      <MetricCard
        title="Total Cost"
        value={formatCurrency(metrics.totalCostUsd)}
        infoTooltip="Estimated API cost across all models used."
        trend={trend ? buildTrend(trend.previous.totalCostUsd, trend.current.totalCostUsd, (d) => d === "down") : undefined}
      />
    </div>
  );
}

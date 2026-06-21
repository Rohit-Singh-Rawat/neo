import dynamic from "next/dynamic";
import { computeDashboardMetrics, computePeriodTrend, filterTracesByDateRange, resolveDashboardInterval } from "@/lib/data/metrics";
import { getTraces } from "@/lib/data/traces";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { PageToolbar, PageToolbarLeft, PageToolbarRight } from "@/components/layout/page-toolbar";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";

// Charts depend on recharts and are deferred into their own chunks rather than
// bundled into the route's initial JS — the data they render is computed
// server-side above, so this only affects bundle size, not loading state.
const TraceVolumeChart = dynamic(
  () => import("@/components/dashboard/trace-volume-chart").then((m) => m.TraceVolumeChart),
  { loading: () => <Skeleton className="col-span-full h-[346px] rounded-xl md:col-span-2" /> }
);
const StatusBreakdownChart = dynamic(
  () => import("@/components/dashboard/status-breakdown-chart").then((m) => m.StatusBreakdownChart),
  { loading: () => <Skeleton className="col-span-full h-[346px] rounded-xl md:col-span-1" /> }
);
const CostByModelChart = dynamic(
  () => import("@/components/dashboard/cost-by-model-chart").then((m) => m.CostByModelChart),
  { loading: () => <Skeleton className="h-[346px] rounded-xl" /> }
);
const LatencyChart = dynamic(
  () => import("@/components/dashboard/latency-chart").then((m) => m.LatencyChart),
  { loading: () => <Skeleton className="h-[346px] rounded-xl" /> }
);

type DashboardPageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const range = resolveDashboardInterval(params.range);

  const allTraces = getTraces();
  const scopedTraces = filterTracesByDateRange(allTraces, range);
  const metrics = computeDashboardMetrics(allTraces, range);
  const trend = computePeriodTrend(scopedTraces);

  return (
    <div className="flex flex-col h-full bg-background">
      <PageToolbar className="h-auto py-4">
        <PageToolbarLeft className="flex-col items-start gap-0.5">
          <div className="text-xl font-medium tracking-tight text-foreground">Dashboard</div>
          <div className="text-xs font-medium text-muted-foreground">Real-time trace volume and performance metrics.</div>
        </PageToolbarLeft>
        <PageToolbarRight>
          <DateRangePicker />
        </PageToolbarRight>
      </PageToolbar>

      <div className="flex-1 overflow-auto p-6 space-y-6 w-full">
        <StatTiles metrics={metrics} trend={trend} />

        <div className="grid gap-4 md:grid-cols-3">
          <TraceVolumeChart data={metrics.tracesOverTime} />
          <StatusBreakdownChart
            data={{
              success: metrics.tracesOverTime.reduce((sum, d) => sum + d.success, 0),
              error: metrics.tracesOverTime.reduce((sum, d) => sum + d.error, 0),
              running: metrics.tracesOverTime.reduce((sum, d) => sum + d.running, 0),
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CostByModelChart data={metrics.costByModel} />
          <LatencyChart
            histogram={metrics.latencyHistogram}
            p50={metrics.p50Latency}
            p95={metrics.p95Latency}
            p50Bin={metrics.p50Bin}
            p95Bin={metrics.p95Bin}
          />
        </div>
      </div>
    </div>
  );
}

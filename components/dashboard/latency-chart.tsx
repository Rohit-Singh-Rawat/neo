"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvilBarChart, Bar, XAxis, Grid, Tooltip } from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { ReferenceLine } from "recharts";
import { formatDuration } from "@/lib/format";

const chartConfig = {
  count: {
    label: "Count",
    colors: {
      light: ["var(--chart-1)"],
      dark: ["var(--chart-1)"],
    },
  },
} satisfies ChartConfig;

export function LatencyChart({ 
  histogram, 
  p50, 
  p95,
  p50Bin,
  p95Bin,
  isLoading
}: { 
  histogram: { bin: string; count: number }[],
  p50: number,
  p95: number,
  p50Bin: string,
  p95Bin: string,
  isLoading?: boolean
}) {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">Latency distribution</CardTitle>
        <CardDescription>Response times across the platform</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 sm:pt-6 pb-0">
        <div className="h-[250px] w-full relative">
          <EvilBarChart data={histogram} config={chartConfig} className="h-full w-full" chartProps={{ margin: { top: 10, right: 10, left: -20, bottom: 0 }, barCategoryGap: '20%' }} isLoading={isLoading}>
            <Grid strokeDasharray="0" />
            <XAxis dataKey="bin" />
            <Tooltip />
            <Bar dataKey="count" variant="default" radius={4} barProps={{ barSize: 24 }} />
            {p50Bin && <ReferenceLine x={p50Bin} stroke="var(--success)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `P50: ${formatDuration(p50)}`, fill: 'var(--success)', fontSize: 11, offset: 10 }} />}
            {p95Bin && <ReferenceLine x={p95Bin} stroke="var(--destructive)" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: `P95: ${formatDuration(p95)}`, fill: 'var(--destructive)', fontSize: 11, offset: 10 }} />}
          </EvilBarChart>
        </div>
      </CardContent>
    </Card>
  );
}

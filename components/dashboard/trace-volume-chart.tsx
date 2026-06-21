"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvilAreaChart, Area, XAxis, Grid, Tooltip, Legend } from "@/components/evilcharts/charts/area-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";

const chartConfig = {
  success: {
    label: "Success",
    colors: {
      light: ["var(--success)"],
      dark: ["var(--success)"],
    },
  },
  error: {
    label: "Error",
    colors: {
      light: ["var(--destructive)"],
      dark: ["var(--destructive)"],
    },
  },
  running: {
    label: "Running",
    colors: {
      light: ["var(--running)"],
      dark: ["var(--running)"],
    },
  },
} satisfies ChartConfig;

export function TraceVolumeChart({ 
  data,
  isLoading 
}: { 
  data: { date: string; success: number; error: number; running: number }[],
  isLoading?: boolean
}) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      formattedDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, [data]);

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Trace volume</CardTitle>
        <CardDescription>Number of traces captured over time</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 sm:pt-6 pb-0">
        <div className="h-[250px] w-full">
          <EvilAreaChart data={chartData} config={chartConfig} className="h-full w-full" isLoading={isLoading} stackType="stacked">
            <Grid strokeDasharray="0" />
            <XAxis dataKey="formattedDate" />
            <Legend />
            <Tooltip />
            <Area dataKey="success" variant="gradient" strokeVariant="solid" />
            <Area dataKey="error" variant="gradient" strokeVariant="solid" />
            <Area dataKey="running" variant="gradient" strokeVariant="solid" />
          </EvilAreaChart>
        </div>
      </CardContent>
    </Card>
  );
}

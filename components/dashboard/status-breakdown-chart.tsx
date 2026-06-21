"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvilPieChart, Pie, Tooltip, Legend } from "@/components/evilcharts/charts/pie-chart";
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

export function StatusBreakdownChart({ 
  data,
  isLoading
}: { 
  data: { success: number; error: number; running: number },
  isLoading?: boolean
}) {
  const chartData = [
    { name: "success", value: data.success },
    { name: "error", value: data.error },
    { name: "running", value: data.running },
  ].filter(d => d.value > 0);

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">Status breakdown</CardTitle>
        <CardDescription>Proportion of traces by resolution status</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 sm:pt-6 pb-0">
        <div className="h-[250px] w-full relative">
          <EvilPieChart data={chartData} config={chartConfig} className="h-full w-full" dataKey="value" nameKey="name" isLoading={isLoading}>
            <Tooltip />
            <Legend isClickable />
            <Pie isClickable innerRadius={30} paddingAngle={4} cornerRadius={8} />
          </EvilPieChart>
        </div>
      </CardContent>
    </Card>
  );
}

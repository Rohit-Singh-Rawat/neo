"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvilBarChart, Bar, XAxis, YAxis, Grid, Tooltip } from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";

const chartConfig = {
  costUsd: {
    label: "Cost",
    colors: {
      light: ["var(--chart-1)"],
      dark: ["var(--chart-1)"],
    },
  },
} satisfies ChartConfig;

export function CostByModelChart({ 
  data,
  isLoading
}: { 
  data: { model: string; costUsd: number }[],
  isLoading?: boolean 
}) {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">Cost by model</CardTitle>
        <CardDescription>Estimated spend across different models</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 sm:pt-6 pb-0">
        <div className="h-[250px] w-full relative">
          <EvilBarChart data={data} config={chartConfig} className="h-full w-full" layout="horizontal" chartProps={{ margin: { left: 10, right: 20 } }} isLoading={isLoading}>
            <Grid strokeDasharray="0" />
            <YAxis dataKey="model" width={140} tickFormatter={(val) => val.toString()} />
            <XAxis type="number" tickFormatter={(val) => `$${val.toFixed(2)}`} hide />
            <Tooltip />
            <Bar dataKey="costUsd" variant="default" />
          </EvilBarChart>
        </div>
      </CardContent>
    </Card>
  );
}

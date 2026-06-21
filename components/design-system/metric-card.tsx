import * as React from "react"
import { ArrowUpRight01Icon, ArrowDownRight01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | React.ReactNode
  infoTooltip?: string
  trend?: {
    value: number | string
    direction: "up" | "down" | "neutral"
    label?: string
    isGood?: boolean // Defaults to direction === "up" ? true : false, but can override (e.g., lower latency is good)
  }
  sparkline?: {
    data: number[]
    color?: string // Optional override, otherwise inherits from trend/theme
  }
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  infoTooltip,
  trend,
  sparkline,
  isLoading,
  className,
  ...props
}: MetricCardProps) {
  const isGood = trend?.isGood ?? (trend?.direction === "up")
  const trendColor = trend?.direction === "neutral"
    ? "text-muted-foreground"
    : isGood
      ? "text-success"
      : "text-destructive"

  const sparklineColor = sparkline?.color || (
    trend?.direction === "neutral"
      ? "var(--muted-foreground)"
      : isGood
        ? "var(--success)"
        : "var(--destructive)"
  )

  const renderSparkline = () => {
    if (!sparkline?.data || sparkline.data.length < 2) return null;

    const data = sparkline.data;
    const max = Math.max(...data) || 1; // avoid div by 0
    const min = Math.min(...data);
    const range = max - min || 1;

    const width = 80;
    const height = 30;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      // SVG's y-axis grows downward, so the highest value maps to y=0
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(" L ")}`;

    return (
      <div className="flex items-end justify-end h-full">
        <svg 
          viewBox={`-2 -2 ${width + 4} ${height + 4}`} 
          className="w-20 h-8 overflow-visible"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <style>{`
            @keyframes sparkline-draw {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
          <path
            d={pathD}
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
            style={{ 
              strokeDasharray: 300, 
              strokeDashoffset: 300, 
              animation: "sparkline-draw 1.5s ease-out forwards" 
            }}
          />
        </svg>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-row justify-between rounded-xl ring-1 ring-foreground/10 bg-card p-4", className)} {...props}>
        <div className="flex flex-col justify-between gap-1 h-[72px]">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-row justify-between rounded-xl ring-1 ring-foreground/10 bg-card text-card-foreground p-4",
        className
      )}
      {...props}
    >
      {/* Left side: Value and Title */}
      <div className="flex flex-col justify-between gap-1 min-w-0">
        <div className="text-2xl 2xl:text-3xl font-medium tracking-tight tabular-nums truncate">{value}</div>
        
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap">
          <span className="truncate">{title}</span>
          {infoTooltip && (
            <TooltipProvider delay={200}>
              <Tooltip>
                <TooltipTrigger render={
                  <button className="text-muted-foreground/70 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                    <HugeiconsIcon icon={InformationCircleIcon} size={14} />
                    <span className="sr-only">More information</span>
                  </button>
                } />
                <TooltipContent side="top">
                  <p className="max-w-[200px] text-xs">{infoTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Right side: Sparkline and Trend */}
      <div className="flex flex-col items-end justify-between gap-2 shrink-0 ml-2">
        <div className="h-8 flex items-start">
          {sparkline && renderSparkline()}
        </div>

        {trend && (
          <div className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted/50", trendColor)}>
            {trend.direction === "up" && <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} className="mr-1" />}
            {trend.direction === "down" && <HugeiconsIcon icon={ArrowDownRight01Icon} size={12} className="mr-1" />}
            {trend.direction === "neutral" && <span className="mr-1">-</span>}
            <span className="tabular-nums">
              {trend.value}{trend.label}
            </span>
            <span className="sr-only">
              {trend.direction === "up" ? "Increased by" : trend.direction === "down" ? "Decreased by" : "No change"} {trend.value}{trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

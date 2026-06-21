"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon } from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const INTERVALS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 15 days", value: "15d" },
  { label: "Last 20 days", value: "20d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 6 months", value: "6m" },
]

const DEFAULT_INTERVAL = "15d"

/** Reads the dashboard's selected interval from the `range` search param, falling back to the default. */
export function useDashboardRangeParam(): string {
  const searchParams = useSearchParams()
  return searchParams.get("range") ?? DEFAULT_INTERVAL
}

export function DateRangePicker() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const value = useDashboardRangeParam()
  const activeLabel = INTERVALS.find(i => i.value === value)?.label

  function selectInterval(next: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (next === DEFAULT_INTERVAL) params.delete("range")
    else params.set("range", next)
    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/50 dark:border-border bg-muted/30 hover:bg-muted/80" title={activeLabel} />
        }
      >
        <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-foreground/70" />
        <span className="sr-only">{activeLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px] rounded-xl shadow-xl border-border/50 dark:border-border">
        {INTERVALS.map((interval) => (
          <DropdownMenuItem
            key={interval.value}
            onClick={() => selectInterval(interval.value)}
            className={cn("text-xs font-medium cursor-pointer py-2", value === interval.value && "bg-muted text-foreground")}
          >
            {interval.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

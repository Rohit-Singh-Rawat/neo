"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Layers01Icon } from "@hugeicons/core-free-icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PageToolbar, PageToolbarLeft, PageToolbarRight } from "@/components/layout/page-toolbar"
import { FilterMenu, type FilterDefinition } from "@/components/ui/filter-menu"
import { ViewOptionsMenu, type ViewOptionConfig, type ViewRadioGroup } from "@/components/ui/view-options-menu"

// Example robust configuration for the issues page
const issueFilters: FilterDefinition[] = [
  {
    id: "priority",
    label: "Priority",
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    id: "status",
    label: "Status",
    options: [
      { value: "todo", label: "Todo" },
      { value: "in-progress", label: "In Progress" },
      { value: "backlog", label: "Backlog" },
      { value: "done", label: "Done" },
    ],
  },
]

const viewGroups: ViewRadioGroup[] = [
  {
    id: "grouping",
    label: "Grouping",
    defaultValue: "status",
    options: [
      { value: "status", label: "Status" },
      { value: "assignee", label: "Assignee" },
      { value: "priority", label: "Priority" },
      { value: "none", label: "No grouping" },
    ],
  },
]

const viewToggles: ViewOptionConfig[] = [
  { id: "show-assignee", label: "Show Assignee", defaultChecked: true },
  { id: "show-id", label: "Show ID", defaultChecked: true },
  { id: "show-labels", label: "Show Labels", defaultChecked: false },
]

export function IssuesToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "all"

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val === "all") {
      params.delete("view")
    } else {
      params.set("view", val)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <PageToolbar>
      <PageToolbarLeft>
        <Tabs value={currentView} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All issues</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="backlog">Backlog</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-muted/50 rounded-md">
          <HugeiconsIcon icon={Layers01Icon} className="size-4" strokeWidth={1.5} />
        </Button>
      </PageToolbarLeft>

      <PageToolbarRight>
        <FilterMenu filters={issueFilters} />
        <ViewOptionsMenu radioGroups={viewGroups} toggles={viewToggles} />
      </PageToolbarRight>
    </PageToolbar>
  )
}

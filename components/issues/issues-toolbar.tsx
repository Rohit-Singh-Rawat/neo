"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterMailIcon, Task01Icon, Alert01Icon } from "@hugeicons/core-free-icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PageToolbar, PageToolbarLeft, PageToolbarRight } from "@/components/layout/page-toolbar"
import { DisplayPropertiesMenu } from "@/components/design-system/display-properties-menu"
import { ResponsiveFilterMenu } from "@/components/ui/responsive-filter-menu"

import { useDocumentKeyDown } from "@/hooks/use-document-keydown"
import { type IssueStatus, type IssuePriority } from "@/lib/store/issues"
import { statusIconMap, priorityIconMap } from "./issue-icons"
export type IssueOptionalColumn = "id" | "assignee" | "labels" | "priority" | "createdAt"

const optionalColumns: { key: IssueOptionalColumn; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "assignee", label: "Assignee" },
  { key: "labels", label: "Labels" },
  { key: "priority", label: "Priority" },
  { key: "createdAt", label: "Created" },
]

const PARAM_DEFAULTS: Record<string, string> = {
  view: "all",
  status: "all",
  priority: "all",
  sort: "newest",
  group: "status",
}

export function IssuesToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "all"
  const currentStatus = searchParams.get("status") || "all"
  const currentPriority = searchParams.get("priority") || "all"
  const currentSort = searchParams.get("sort") || "newest"
  const currentGroup = searchParams.get("group") || "status"
  const currentColumnsRaw = searchParams.get("cols")
  const currentColumns: IssueOptionalColumn[] = currentColumnsRaw
    ? (currentColumnsRaw.split(",") as IssueOptionalColumn[])
    : ["id", "assignee", "priority"]

  const [filterOpen, setFilterOpen] = React.useState(false)

  useDocumentKeyDown((event) => {
    if (event.key === "f" || event.key === "F") {
      event.preventDefault()
      setFilterOpen((prev) => !prev)
    }
  })

  interface NavParams {
    view?: string
    status?: string
    priority?: string
    sort?: string
    group?: string
    columns?: IssueOptionalColumn[]
  }

  function navigate(next: NavParams) {
    const params = new URLSearchParams(searchParams.toString())

    const scalarEntries: [string, string | undefined][] = [
      ["view", next.view],
      ["status", next.status],
      ["priority", next.priority],
      ["sort", next.sort],
      ["group", next.group],
    ]

    for (const [key, value] of scalarEntries) {
      if (value === undefined) continue
      if (value === PARAM_DEFAULTS[key]) params.delete(key)
      else params.set(key, value)
    }

    if (next.columns !== undefined) {
      if (next.columns.length > 0) params.set("cols", next.columns.join(","))
      else params.delete("cols")
    }

    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }

  function toggleColumn(key: IssueOptionalColumn, visible: boolean) {
    const next = visible
      ? [...currentColumns, key]
      : currentColumns.filter((c) => c !== key)
    navigate({ columns: next })
  }

  const activeFilterCount = (currentStatus !== "all" ? 1 : 0) + (currentPriority !== "all" ? 1 : 0)

  return (
    <PageToolbar>
      <PageToolbarLeft className="flex-1 min-w-0 overflow-x-auto pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Tabs value={currentView} onValueChange={(val) => navigate({ view: val })}>
          <TabsList variant="pills" className="flex-nowrap whitespace-nowrap h-8">
            <TabsTrigger value="all">All issues</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="backlog">Backlog</TabsTrigger>
          </TabsList>
        </Tabs>
      </PageToolbarLeft>

      <PageToolbarRight className="shrink-0 justify-end ml-auto">
        <ResponsiveFilterMenu
          title="Add Filter"
          open={filterOpen}
          onOpenChange={setFilterOpen}
          groups={[
            {
              id: "status",
              label: "Status",
              icon: <HugeiconsIcon icon={Task01Icon} size={14} />,
              badge: currentStatus !== "all" ? currentStatus : undefined,
              type: "radio",
              value: currentStatus,
              onChange: (value) => navigate({ status: value }),
              options: [
                { label: "All", value: "all" },
                ...( ["todo", "in-progress", "backlog", "done", "canceled", "duplicate"] as IssueStatus[] ).map((s) => {
                  const Icon = statusIconMap[s]
                  return {
                    label: <span className="capitalize">{s.replace("-", " ")}</span>,
                    value: s,
                    icon: <Icon className="size-4 text-muted-foreground" />,
                  }
                }),
              ],
            },
            {
              id: "priority",
              label: "Priority",
              icon: <HugeiconsIcon icon={Alert01Icon} size={14} />,
              badge: currentPriority !== "all" ? currentPriority : undefined,
              type: "radio",
              value: currentPriority,
              onChange: (value) => navigate({ priority: value }),
              options: [
                { label: "All", value: "all" },
                ...( ["urgent", "high", "medium", "low"] as IssuePriority[] ).map((p) => {
                  const Icon = priorityIconMap[p]
                  return {
                    label: <span className="capitalize">{p}</span>,
                    value: p,
                    icon: <Icon className="size-4 text-muted-foreground" />,
                  }
                }),
              ],
            },
          ]}
          activeFilterCount={activeFilterCount}
          onClearAll={() => navigate({ status: "all", priority: "all" })}
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-full border-border/50 dark:border-border bg-background hover:bg-muted/50"
            >
              <HugeiconsIcon icon={FilterMailIcon} strokeWidth={1.5} size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-sky-500 ring-1 ring-background shadow-sm" />
              )}
              <span className="sr-only">Filter</span>
            </Button>
          }
        />

        <DisplayPropertiesMenu
          columns={optionalColumns}
          visible={currentColumns}
          onToggle={toggleColumn}
          onReset={() => navigate({ columns: [], sort: "newest", group: "status" })}
          sortValue={currentSort}
          onSortChange={(value) => {
            if (value) navigate({ sort: value });
          }}
          sortOptions={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "updated", label: "Recently updated" },
          ]}
          groupValue={currentGroup}
          onGroupChange={(value) => {
            if (value) navigate({ group: value });
          }}
          groupOptions={[
            { value: "none", label: "No grouping" },
            { value: "status", label: "Status" },
            { value: "priority", label: "Priority" },
            { value: "assignee", label: "Assignee" },
          ]}
        />
      </PageToolbarRight>
    </PageToolbar>
  )
}

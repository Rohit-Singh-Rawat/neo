"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Search01Icon, UserCircleIcon } from "@hugeicons/core-free-icons"
import { DataList } from "@/components/design-system/data-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useIssuesStore, type Issue, type IssueStatus, type IssuePriority } from "@/lib/store/issues"
import { statusIconMap, statusLabels, priorityIconMap } from "./issue-icons"
import { CreateIssueModal } from "./create-issue-modal"
import { IssueCells, STATUS_GROUP_ORDER, PRIORITY_GROUP_ORDER, type IssueOptionalColumn } from "./issue-cells"
import { IssuesActionBar } from "./issues-action-bar"
import { useCommandPalette } from "@/components/command-palette/command-palette-provider"

export type { IssueOptionalColumn }

/** Issues list view — headerless, grouped dynamically, using the shared DataList system. */
export function IssuesList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const issues = useIssuesStore((state) => state.issues)
  const { setContext } = useCommandPalette()

  function handleSelectionChange(selectedIds: Set<string>, clearSelection: () => void) {
    if (selectedIds.size === 0) {
      setContext({ type: "global" })
      return
    }
    setContext({
      type: "issue",
      selectedIds,
      selectedIssues: issues.filter((i) => selectedIds.has(i.id)),
      clearSelection,
    })
  }

  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [createModalDefaults, setCreateModalDefaults] = React.useState<{ status?: IssueStatus; priority?: IssuePriority; assignee?: string }>()

  const currentView = searchParams.get("view") || "all"
  const currentStatus = searchParams.get("status") || "all"
  const currentPriority = searchParams.get("priority") || "all"
  const currentGroup = searchParams.get("group") || "status"

  const currentColumnsRaw = searchParams.get("cols")
  const currentColumns: IssueOptionalColumn[] = currentColumnsRaw 
    ? (currentColumnsRaw.split(",") as IssueOptionalColumn[]) 
    : ["id", "assignee", "priority"]

  const filteredIssues = issues.filter((issue) => {
    if (currentView === "active" && ["done", "canceled", "duplicate"].includes(issue.status)) return false
    if (currentView === "backlog" && issue.status !== "backlog") return false

    if (currentStatus !== "all" && issue.status !== currentStatus) return false
    if (currentPriority !== "all" && issue.priority !== currentPriority) return false
    
    return true
  })

  let activeGroups: { key: string; title: string; issues: Issue[]; icon?: React.ReactNode }[] = []

  if (currentGroup === "status") {
    const issuesByStatus = STATUS_GROUP_ORDER.reduce((acc, s) => ({ ...acc, [s]: [] as Issue[] }), {} as Record<IssueStatus, Issue[]>)
    for (const issue of filteredIssues) {
      issuesByStatus[issue.status].push(issue)
    }
    activeGroups = STATUS_GROUP_ORDER
      .filter((s) => issuesByStatus[s].length > 0)
      .map((s) => {
        const StatusIcon = statusIconMap[s]
        return {
          key: s,
          title: statusLabels[s],
          issues: issuesByStatus[s],
          icon: <StatusIcon />,
        }
      })
  } else if (currentGroup === "priority") {
    const issuesByPriority = PRIORITY_GROUP_ORDER.reduce((acc, p) => ({ ...acc, [p]: [] as Issue[] }), {} as Record<IssuePriority, Issue[]>)
    for (const issue of filteredIssues) {
      issuesByPriority[issue.priority].push(issue)
    }
    activeGroups = PRIORITY_GROUP_ORDER
      .filter((p) => issuesByPriority[p].length > 0)
      .map((p) => {
        const PriorityIcon = priorityIconMap[p]
        return {
          key: p,
          title: p.charAt(0).toUpperCase() + p.slice(1) + " Priority",
          issues: issuesByPriority[p],
          icon: <PriorityIcon />,
        }
      })
  } else if (currentGroup === "assignee") {
    const assignees = Array.from(new Set(filteredIssues.map(i => i.assignee || "unassigned")))
    activeGroups = assignees.map(a => ({
      key: a,
      title: a === "unassigned" ? "Unassigned" : a,
      issues: filteredIssues.filter(i => (i.assignee || "unassigned") === a),
      icon: a === "unassigned" ? (
        <HugeiconsIcon icon={UserCircleIcon} className="size-3.5 text-muted-foreground" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${a}`} alt={a} className="size-3.5 rounded-full bg-muted" />
      ),
    }))
  } else {
    if (filteredIssues.length > 0) {
      activeGroups = [{ key: "all", title: "All Issues", issues: filteredIssues }]
    }
  }

  return (
    <DataList.Root
      itemIds={filteredIssues.map((i) => i.id)}
      onItemAction={(id) => router.push(`/issues/${id}`)}
      onSelectionChange={handleSelectionChange}
      initialCollapsedGroups={["canceled", "duplicate", "done"]}
    >
      <DataList.Content tableClassName="min-w-0 w-full">
        <DataList.Body>
          {activeGroups.map((group) => (
            <DataList.Group
              key={group.key}
              groupKey={group.key}
              title={group.title}
              count={group.issues.length}
              icon={group.icon}
              headerAction={
                <button
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-label={`Add issue to ${group.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    const defaults: { status?: IssueStatus; priority?: IssuePriority; assignee?: string } = {}
                    if (currentGroup === "status") {
                      defaults.status = group.key as IssueStatus
                    } else if (currentGroup === "priority") {
                      defaults.priority = group.key as IssuePriority
                    } else if (currentGroup === "assignee" && group.key !== "unassigned") {
                      defaults.assignee = group.key
                    }
                    setCreateModalDefaults(defaults)
                    setCreateModalOpen(true)
                  }}
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={14} />
                </button>
              }
            >
              {group.issues.map((issue) => (
                <DataList.Row key={issue.id} itemId={issue.id}>
                  <IssueCells issue={issue} visibleColumns={currentColumns} />
                </DataList.Row>
              ))}
            </DataList.Group>
          ))}

          {filteredIssues.length === 0 && (
            <DataList.Row itemId="__empty__">
              <DataList.Cell colSpan={20} className="p-8">
                <Empty className="border-0 bg-transparent">
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><HugeiconsIcon icon={Search01Icon} /></EmptyMedia>
                    <EmptyTitle>No matching issues</EmptyTitle>
                    <EmptyDescription>No issues match the current filters.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </DataList.Cell>
            </DataList.Row>
          )}
        </DataList.Body>
      </DataList.Content>

      <DataList.ActionBar>
        {({ selectedIds, clearSelection }) => (
          <IssuesActionBar selectedIds={selectedIds} onComplete={clearSelection} />
        )}
      </DataList.ActionBar>

      <CreateIssueModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
        defaultValues={createModalDefaults} 
      />
    </DataList.Root>
  )
}

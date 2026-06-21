"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon, GitMergeIcon } from "@hugeicons/core-free-icons"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/design-system/status-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIssuesStore, type IssueStatus, type IssuePriority } from "@/lib/store/issues"
import { statusIconMap, statusLabels, priorityIconMap, labelDotColor } from "@/components/issues/issue-icons"
import { getTraceById } from "@/lib/data/traces"
import { formatCurrency, formatDuration, formatTokenCount } from "@/lib/format"

const STATUS_ORDER: IssueStatus[] = ["todo", "in-progress", "backlog", "done", "canceled", "duplicate"]
const PRIORITY_ORDER: IssuePriority[] = ["urgent", "high", "medium", "low"]

export function IssueDetail({ issueId }: { issueId: string }) {
  const issue = useIssuesStore((s) => s.issues.find((i) => i.id === issueId))
  const updateStatus = useIssuesStore((s) => s.updateIssueStatus)
  const updatePriority = useIssuesStore((s) => s.updateIssuePriority)

  if (!issue) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon"><HugeiconsIcon icon={GitMergeIcon} /></EmptyMedia>
          <EmptyTitle>Issue not found</EmptyTitle>
          <EmptyDescription>This issue doesn&apos;t exist, or it was deleted.</EmptyDescription>
        </EmptyHeader>
        <Button render={<Link href="/issues" />}>Back to issues</Button>
      </Empty>
    )
  }

  const StatusIcon = statusIconMap[issue.status]
  const PriorityIcon = priorityIconMap[issue.priority]
  const trace = issue.traceId ? getTraceById(issue.traceId) : undefined
  const rootSpan = trace?.spans.find((span) => span.parentId === null)

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="border-b border-border/50 dark:border-border px-6 py-4">
        <Link
          href="/issues"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeftIcon} size={14} />
          Issues
        </Link>

        <p className="mt-3 font-mono text-xs text-muted-foreground">{issue.id}</p>
        <h1 className="mt-1 text-lg font-medium tracking-tight">{issue.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5">
                  <StatusIcon />
                  {statusLabels[issue.status]}
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuRadioGroup
                value={issue.status}
                onValueChange={(val) => updateStatus(issue.id, val as IssueStatus)}
              >
                {STATUS_ORDER.map((s) => {
                  const Icon = statusIconMap[s]
                  return (
                    <DropdownMenuRadioItem key={s} value={s} className="text-xs">
                      <Icon className="mr-2 size-3.5" />
                      {statusLabels[s]}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5 capitalize">
                  <PriorityIcon />
                  {issue.priority}
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuRadioGroup
                value={issue.priority}
                onValueChange={(val) => updatePriority(issue.id, val as IssuePriority)}
              >
                {PRIORITY_ORDER.map((p) => {
                  const Icon = priorityIconMap[p]
                  return (
                    <DropdownMenuRadioItem key={p} value={p} className="text-xs capitalize">
                      <Icon className="mr-2 size-3.5" />
                      {p}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {issue.assignee && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/50 dark:border-border px-2 py-1 text-xs text-muted-foreground">
              <span className="size-4 overflow-hidden rounded-full bg-muted">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${issue.assignee}`}
                  alt=""
                  className="size-full object-cover"
                />
              </span>
              {issue.assignee}
            </span>
          )}

          {issue.labels.map((label) => (
            <span
              key={label.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/50 dark:border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
            >
              <span className={`size-2 rounded-full ${labelDotColor[label.color]}`} />
              {label.name}
            </span>
          ))}

          <span className="ml-auto text-xs text-muted-foreground">
            Created{" "}
            {new Date(issue.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6">
        <h2 className="text-sm font-medium text-foreground">Linked trace</h2>
        {trace ? (
          <Link
            href={`/traces/${trace.id}`}
            className="mt-2 flex items-center justify-between gap-4 rounded-lg border border-border/50 dark:border-border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{trace.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{trace.id}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <span className="font-mono tabular-nums text-muted-foreground">
                {rootSpan?.latencyMs ? formatDuration(rootSpan.latencyMs) : "—"}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {formatTokenCount(trace.totalTokens)} tokens
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">{formatCurrency(trace.totalCostUsd)}</span>
              <StatusIndicator status={trace.status} showLabel />
            </div>
          </Link>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No trace linked to this issue.</p>
        )}
      </div>
    </div>
  )
}

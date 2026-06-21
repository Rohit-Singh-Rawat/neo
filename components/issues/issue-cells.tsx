import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon, GitMergeIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { DataList } from "@/components/design-system/data-list"
import { useIssuesStore, type Issue, type IssueStatus, type IssuePriority } from "@/lib/store/issues"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { statusIconMap, statusLabels, priorityIconMap, PriorityNoneIcon, labelDotColor } from "./issue-icons"

const STATUS_GROUP_ORDER: IssueStatus[] = ["in-progress", "todo", "backlog", "done", "canceled", "duplicate"]
const PRIORITY_GROUP_ORDER: IssuePriority[] = ["urgent", "high", "medium", "low"]

export type IssueOptionalColumn = "id" | "assignee" | "labels" | "priority" | "createdAt"

/** Row content for one issue in the `DataList`: selection checkbox, priority/status pickers, title, and the optional trailing columns. */
export function IssueCells({ issue, visibleColumns }: { issue: Issue; visibleColumns: IssueOptionalColumn[] }) {
  const updateStatus = useIssuesStore(s => s.updateIssueStatus)
  const updatePriority = useIssuesStore(s => s.updateIssuePriority)

  const PriorityIcon = priorityIconMap[issue.priority] ?? PriorityNoneIcon
  const StatusIcon = statusIconMap[issue.status]

  return (
    <>
      <DataList.Selection
        itemId={issue.id}
        className="opacity-0 group-hover/row:opacity-100 data-checked:opacity-100 transition-opacity size-3.5 rounded-[3px]"
        aria-label={`Select ${issue.title}`}
      />

      {visibleColumns.includes("priority") && (
        <DataList.Cell className="w-8 p-1">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button
                className="flex size-6 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label={`Change priority, currently ${issue.priority}`}
                onClick={(e) => e.stopPropagation()}
              >
                <PriorityIcon className="shrink-0" />
              </button>
            } />
            <DropdownMenuContent align="start" className="w-[150px]">
               <DropdownMenuRadioGroup value={issue.priority} onValueChange={(val) => updatePriority(issue.id, val as IssuePriority)}>
                 {PRIORITY_GROUP_ORDER.map(p => {
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
        </DataList.Cell>
      )}

      {visibleColumns.includes("id") && (
        <DataList.Cell className="hidden sm:table-cell w-20 p-1.5">
          <span className="text-xs text-muted-foreground font-mono">{issue.id}</span>
        </DataList.Cell>
      )}

      <DataList.Cell className="w-8 p-1">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              className="flex size-6 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Change status, currently ${statusLabels[issue.status]}`}
              onClick={(e) => e.stopPropagation()}
            >
              <StatusIcon className="shrink-0" />
            </button>
          } />
          <DropdownMenuContent align="start" className="w-[150px]">
             <DropdownMenuRadioGroup value={issue.status} onValueChange={(val) => updateStatus(issue.id, val as IssueStatus)}>
               {STATUS_GROUP_ORDER.map(s => {
                 const Icon = statusIconMap[s]
                 return (
                   <DropdownMenuRadioItem key={s} value={s} className="text-xs capitalize">
                     <Icon className="mr-2 size-3.5" />
                     {s.replace("-", " ")}
                   </DropdownMenuRadioItem>
                 )
               })}
             </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </DataList.Cell>

      <DataList.Cell className="p-1.5 w-full max-w-0">
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {issue.traceId && (
            <Link
              href={`/traces/${issue.traceId}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground rounded-full border border-border/50 dark:border-border px-2 py-0.5 bg-background hover:bg-muted hover:text-foreground transition-colors shrink-0 whitespace-nowrap"
            >
              <HugeiconsIcon icon={GitMergeIcon} size={12} className="text-muted-foreground" />
              <span className="font-mono">{issue.traceId.substring(0, 8)}</span>
            </Link>
          )}

          <span className="font-medium text-sm text-foreground truncate block">
            {issue.title}
          </span>
        </div>
      </DataList.Cell>

      <DataList.Cell className="p-1.5 whitespace-nowrap">
        <div className="flex items-center justify-end gap-3">

          {visibleColumns.includes("labels") && issue.labels.length > 0 && (
            <div className="flex items-center gap-1.5">
              {issue.labels.map((label) => (
                <span
                  key={label.name}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground rounded-full border border-border/50 dark:border-border px-2 py-0.5 bg-background"
                >
                  <span className={`size-2 rounded-full ${labelDotColor[label.color]}`} />
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {visibleColumns.includes("assignee") && (
            <div className="size-5 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground border border-border/50 dark:border-border">
              {issue.assignee ? (
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${issue.assignee}`}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <HugeiconsIcon icon={UserCircleIcon} size={14} />
              )}
            </div>
          )}

          {visibleColumns.includes("createdAt") && (
            <span className="text-[11px] text-muted-foreground w-16 text-right tabular-nums whitespace-nowrap">
              {new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}

          {issue.dueDate && (
            <span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
              {issue.dueDate}
            </span>
          )}
        </div>
      </DataList.Cell>
    </>
  )
}

export { STATUS_GROUP_ORDER, PRIORITY_GROUP_ORDER }

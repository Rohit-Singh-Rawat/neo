import { toast } from "sonner"
import { CircleDotIcon, SignalIcon, CopyIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CommandGroup, CommandItem } from "@/components/ui/command"
import { useIssuesStore, type IssueStatus, type IssuePriority } from "@/lib/store/issues"
import { statusIconMap, priorityIconMap } from "@/components/issues/issue-icons"
import { registerActions, registerPage } from "./registry"

registerActions([
  {
    id: "change-status",
    label: "Change status…",
    icon: (props) => <HugeiconsIcon icon={CircleDotIcon} {...props} />,
    shortcut: "S",
    group: "Issue",
    contextTypes: ["issue"],
    type: "page",
    page: "status",
  },
  {
    id: "change-priority",
    label: "Change priority…",
    icon: (props) => <HugeiconsIcon icon={SignalIcon} {...props} />,
    shortcut: "P",
    group: "Issue",
    contextTypes: ["issue"],
    type: "page",
    page: "priority",
  },
  {
    id: "copy-issue-id",
    label: "Copy issue ID",
    icon: (props) => <HugeiconsIcon icon={CopyIcon} {...props} />,
    group: "Issue",
    contextTypes: ["issue"],
    type: "action",
    perform: (ctx) => {
      if (ctx.type !== "issue") return
      navigator.clipboard.writeText(Array.from(ctx.selectedIds).join(", "))
      toast.success("Copied to clipboard")
    },
  },
  {
    id: "delete-issues",
    label: "Delete",
    icon: (props) => <HugeiconsIcon icon={Delete02Icon} {...props} />,
    group: "Danger",
    contextTypes: ["issue"],
    type: "action",
    perform: (ctx) => {
      if (ctx.type !== "issue") return
      useIssuesStore.getState().bulkDelete(Array.from(ctx.selectedIds))
      toast.success(`Deleted ${ctx.selectedIds.size} issue(s)`)
      ctx.clearSelection()
    },
  },
])

registerPage({
  id: "status",
  label: "Status",
  render: (ctx, onComplete) => {
    if (ctx.type !== "issue") return null
    const statuses: IssueStatus[] = ["todo", "in-progress", "backlog", "done", "canceled", "duplicate"]
    return (
      <CommandGroup heading="Set status">
        {statuses.map((s) => {
          const Icon = statusIconMap[s]
          return (
            <CommandItem
              key={s}
              onSelect={() => {
                useIssuesStore.getState().bulkUpdateStatus(Array.from(ctx.selectedIds), s)
                toast.success(`Updated ${ctx.selectedIds.size} issue(s) to ${s}`)
                ctx.clearSelection()
                onComplete()
              }}
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="capitalize">{s.replace("-", " ")}</span>
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  },
})

registerPage({
  id: "priority",
  label: "Priority",
  render: (ctx, onComplete) => {
    if (ctx.type !== "issue") return null
    const priorities: IssuePriority[] = ["urgent", "high", "medium", "low"]
    return (
      <CommandGroup heading="Set priority">
        {priorities.map((p) => {
          const Icon = priorityIconMap[p]
          return (
            <CommandItem
              key={p}
              onSelect={() => {
                useIssuesStore.getState().bulkUpdatePriority(Array.from(ctx.selectedIds), p)
                toast.success(`Updated ${ctx.selectedIds.size} issue(s) to ${p}`)
                ctx.clearSelection()
                onComplete()
              }}
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="capitalize">{p}</span>
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  },
})

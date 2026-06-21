"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tag01Icon, UserCircleIcon, SearchIcon, LinkSquare01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getTraces } from "@/lib/data/traces"
import type { IssueStatus, IssuePriority, IssueLabel } from "@/lib/store/issues"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { statusIconMap, priorityIconMap, labelDotColor, PREDEFINED_LABELS } from "./issue-icons"

/** Field-picker trigger styling shared by every pill in the create-issue form. */
export const PILL_TRIGGER_CLASS =
  "h-7 rounded-full px-2.5 text-xs border-border/50 dark:border-border text-muted-foreground hover:text-foreground hover:border-border/50 dark:border-border transition-colors shadow-none"

const STATUS_OPTIONS: IssueStatus[] = ["todo", "in-progress", "backlog", "done", "canceled", "duplicate"]
const PRIORITY_OPTIONS: IssuePriority[] = ["urgent", "high", "medium", "low"]
const ALL_TRACE_IDS = getTraces().map((t) => t.id)

export function StatusPicker({ status, onChange }: { status: IssueStatus; onChange: (status: IssueStatus) => void }) {
  const Icon = statusIconMap[status]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={PILL_TRIGGER_CLASS}>
            <Icon className="mr-1.5 size-3.5" />
            <span className="capitalize">{status.replace("-", " ")}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[150px] rounded-lg">
        <DropdownMenuRadioGroup value={status} onValueChange={(val) => onChange(val as IssueStatus)}>
          {STATUS_OPTIONS.map((s) => {
            const OptionIcon = statusIconMap[s]
            return (
              <DropdownMenuRadioItem key={s} value={s} className="text-xs capitalize rounded-md">
                <OptionIcon className="mr-2 size-3.5" />
                {s.replace("-", " ")}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PriorityPicker({
  priority,
  onChange,
}: {
  priority: IssuePriority
  onChange: (priority: IssuePriority) => void
}) {
  const Icon = priorityIconMap[priority]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={PILL_TRIGGER_CLASS}>
            <Icon className="mr-1.5 size-3.5" />
            <span className="capitalize">{priority}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[150px] rounded-lg">
        <DropdownMenuRadioGroup value={priority} onValueChange={(val) => onChange(val as IssuePriority)}>
          {PRIORITY_OPTIONS.map((p) => {
            const OptionIcon = priorityIconMap[p]
            return (
              <DropdownMenuRadioItem key={p} value={p} className="text-xs capitalize rounded-md">
                <OptionIcon className="mr-2 size-3.5" />
                {p}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TraceLinkPicker({ traceId, onChange }: { traceId: string; onChange: (traceId: string) => void }) {
  const [query, setQuery] = React.useState("")
  const matchingTraces = query.trim()
    ? ALL_TRACE_IDS.filter((id) => id.toLowerCase().includes(query.trim().toLowerCase()))
    : ALL_TRACE_IDS

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              PILL_TRIGGER_CLASS,
              "font-normal",
              traceId && "text-blue-500 border-blue-500/30 bg-blue-500/5 hover:text-blue-600"
            )}
          >
            <HugeiconsIcon icon={LinkSquare01Icon} size={14} className="mr-1.5" />
            {traceId || "Trace ID"}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[200px] p-0 rounded-lg overflow-hidden">
        <div className="flex items-center px-2 py-1.5 border-b border-border/50 dark:border-border">
          <HugeiconsIcon icon={SearchIcon} size={12} className="text-muted-foreground mr-1" />
          <Input
            placeholder="Search traces..."
            className="h-6 border-0 shadow-none px-1 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="p-1 max-h-[150px] overflow-y-auto">
          <DropdownMenuRadioGroup value={traceId} onValueChange={onChange}>
            {matchingTraces.length > 0 ? (
              matchingTraces.map((t) => (
                <DropdownMenuRadioItem key={t} value={t} className="text-xs font-mono rounded-md py-1.5 cursor-pointer">
                  {t}
                </DropdownMenuRadioItem>
              ))
            ) : (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">No matching traces</p>
            )}
          </DropdownMenuRadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AssigneePicker({ assignee, onChange }: { assignee?: string; onChange: (assignee: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={PILL_TRIGGER_CLASS}>
            {assignee ? (
              <>
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${assignee}`}
                  alt=""
                  className="mr-1.5 size-3.5 rounded-full bg-muted"
                />
                {assignee}
              </>
            ) : (
              <>
                <HugeiconsIcon icon={UserCircleIcon} size={14} className="mr-1.5" />
                Assignee
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[150px] rounded-lg">
        <DropdownMenuRadioGroup value={assignee ?? ""} onValueChange={onChange}>
          <DropdownMenuRadioItem value="user-1" className="text-xs rounded-md">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user-1" alt="" className="size-3.5 rounded-full bg-muted mr-1.5" />
            user-1
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="user-2" className="text-xs rounded-md">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user-2" alt="" className="size-3.5 rounded-full bg-muted mr-1.5" />
            user-2
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LabelPicker({
  selectedLabels,
  onToggleLabel,
  onAddLabel,
}: {
  selectedLabels: IssueLabel[]
  onToggleLabel: (label: IssueLabel) => void
  onAddLabel: (name: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const customLabels = selectedLabels.filter((l) => !PREDEFINED_LABELS.some((p) => p.name === l.name))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={PILL_TRIGGER_CLASS}>
            <HugeiconsIcon icon={Tag01Icon} size={14} className="mr-1.5" />
            {selectedLabels.length > 0 ? (
              <div className="flex items-center gap-1">
                {selectedLabels.map((l) => (
                  <span key={l.name} className="flex items-center gap-1">
                    <span className={`size-1.5 rounded-full ${labelDotColor[l.color]}`} />
                    {l.name}
                  </span>
                ))}
              </div>
            ) : (
              "Labels"
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-[200px] rounded-lg p-0 overflow-hidden">
        <div className="flex items-center px-2 py-1.5 border-b border-border/50 dark:border-border">
          <Input
            placeholder="Add labels..."
            className="h-6 border-0 shadow-none px-1 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === "Enter") {
                e.preventDefault()
                const name = query.trim()
                if (!name) return
                onAddLabel(name)
                setQuery("")
              }
            }}
          />
          <kbd className="inline-flex h-4 items-center rounded border border-border/50 dark:border-border bg-muted/50 px-1 font-mono text-[9px] font-medium text-muted-foreground">
            L
          </kbd>
        </div>
        <div className="p-1">
          {PREDEFINED_LABELS.map((label) => (
            <DropdownMenuCheckboxItem
              key={label.name}
              checked={selectedLabels.some((l) => l.name === label.name)}
              onCheckedChange={() => onToggleLabel(label)}
              className="text-xs rounded-md py-1.5"
            >
              <span className={`mr-2 size-2 rounded-full ${labelDotColor[label.color]}`} />
              {label.name}
            </DropdownMenuCheckboxItem>
          ))}
          {customLabels.map((label) => (
            <DropdownMenuCheckboxItem
              key={label.name}
              checked
              onCheckedChange={() => onToggleLabel(label)}
              className="text-xs rounded-md py-1.5"
            >
              <span className={`mr-2 size-2 rounded-full ${labelDotColor[label.color]}`} />
              {label.name}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

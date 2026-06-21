"use client"

import * as React from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useIssuesStore, type IssueStatus, type IssuePriority, type IssueLabel } from "@/lib/store/issues"
import {
  StatusPicker,
  PriorityPicker,
  TraceLinkPicker,
  AssigneePicker,
  LabelPicker,
} from "./create-issue-pickers"

interface CreateIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: {
    status?: IssueStatus
    priority?: IssuePriority
    assignee?: string
  }
}

/**
 * Owns all form state. Mounted fresh per `key` from the parent every time the
 * modal opens, so reopening with new `defaultValues` just re-initializes via
 * `useState`'s initial-value argument — no reset effect needed.
 */
function CreateIssueForm({
  defaultValues,
  onCreated,
  TitleSlot,
}: {
  defaultValues?: CreateIssueModalProps["defaultValues"]
  onCreated: () => void
  TitleSlot: React.ElementType
}) {
  const createIssue = useIssuesStore((s) => s.createIssue)

  const [title, setTitle] = React.useState("")
  const [traceId, setTraceId] = React.useState("")
  const [status, setStatus] = React.useState<IssueStatus>(defaultValues?.status ?? "todo")
  const [priority, setPriority] = React.useState<IssuePriority>(defaultValues?.priority ?? "medium")
  const [assignee, setAssignee] = React.useState<string | undefined>(defaultValues?.assignee)
  const [selectedLabels, setSelectedLabels] = React.useState<IssueLabel[]>([])

  function handleCreate() {
    if (!title.trim()) return
    createIssue({
      title: title.trim(),
      status,
      priority,
      assignee,
      labels: selectedLabels,
      traceId: traceId.trim() || undefined,
    })
    toast.success("Issue created")
    onCreated()
  }

  function toggleLabel(label: IssueLabel) {
    setSelectedLabels((prev) =>
      prev.find((l) => l.name === label.name)
        ? prev.filter((l) => l.name !== label.name)
        : [...prev, label]
    )
  }

  function addFreeTextLabel(name: string) {
    if (selectedLabels.some((l) => l.name === name)) return
    setSelectedLabels((prev) => [...prev, { name, color: "gray" }])
  }

  return (
    <>
      <div className="flex items-center px-4 py-3 bg-muted/10">
        <TitleSlot className="text-sm font-medium text-foreground">New issue</TitleSlot>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus -- modal's primary field; dialog already owns the focus trap
          autoFocus
          placeholder="Issue title..."
          className="border-0 shadow-none text-lg font-medium px-0 focus-visible:ring-0 placeholder:text-muted-foreground/60 h-auto py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate()
          }}
        />

        <div className="flex items-center gap-2 flex-wrap mt-2">
          <StatusPicker status={status} onChange={setStatus} />
          <TraceLinkPicker traceId={traceId} onChange={setTraceId} />
          <PriorityPicker priority={priority} onChange={setPriority} />
          <AssigneePicker assignee={assignee} onChange={setAssignee} />
          <LabelPicker selectedLabels={selectedLabels} onToggleLabel={toggleLabel} onAddLabel={addFreeTextLabel} />
        </div>
      </div>

      <div className="flex items-center justify-end px-4 py-3 bg-muted/10">
        <Button
          onClick={handleCreate}
          disabled={!title.trim()}
          size="sm"
          className="h-8 rounded-full shadow-none text-xs font-medium px-5"
        >
          Create issue
        </Button>
      </div>
    </>
  )
}

export function CreateIssueModal({ open, onOpenChange, defaultValues }: CreateIssueModalProps) {
  const isMobile = useIsMobile()

  // Bumped each time `open` transitions to true, so the form below remounts
  // (via `key`) and re-seeds from the latest `defaultValues` instead of
  // carrying over whatever was typed during the previous time it was open.
  // This is React's documented "adjust state during render" pattern, not an
  // Effect — it reruns synchronously before paint, with no extra render pass.
  const [wasOpen, setWasOpen] = React.useState(open)
  const [formKey, setFormKey] = React.useState(0)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setFormKey((k) => k + 1)
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0 overflow-hidden outline-none flex flex-col gap-0">
          <CreateIssueForm
            key={formKey}
            defaultValues={defaultValues}
            onCreated={() => onOpenChange(false)}
            TitleSlot={DrawerTitle}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
        <DialogContent
          className="fixed left-1/2 top-1/2 w-full max-w-xl flex flex-col gap-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background shadow-2xl border border-border/50 dark:border-border p-0 overflow-hidden outline-none duration-200 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:fade-out-0 data-open:fade-in-0 sm:max-w-xl"
        >
          <CreateIssueForm
            key={formKey}
            defaultValues={defaultValues}
            onCreated={() => onOpenChange(false)}
            TitleSlot={DialogTitle}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

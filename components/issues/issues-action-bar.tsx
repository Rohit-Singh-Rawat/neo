import { HugeiconsIcon } from "@hugeicons/react"
import { CommandIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useIssuesStore } from "@/lib/store/issues"
import { useCommandPalette } from "@/components/command-palette/command-palette-provider"
import { useConfirm } from "@/components/design-system/confirm-dialog"

/** Bulk-action bar shown above the issues list while one or more rows are selected. */
export function IssuesActionBar({ selectedIds, onComplete }: { selectedIds: Set<string>; onComplete: () => void }) {
  const issues = useIssuesStore((s) => s.issues)
  const bulkDelete = useIssuesStore((s) => s.bulkDelete)
  const restoreIssues = useIssuesStore((s) => s.restoreIssues)
  const confirm = useConfirm()
  const { setOpen } = useCommandPalette()

  const handleDelete = async () => {
    const count = selectedIds.size
    const ok = await confirm({
      title: `Delete ${count} issue${count === 1 ? "" : "s"}?`,
      description: "This can be undone from the confirmation toast.",
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return

    const deleted = issues.filter((issue) => selectedIds.has(issue.id))
    bulkDelete(Array.from(selectedIds))
    onComplete()
    toast.success(`Deleted ${count} issue${count === 1 ? "" : "s"}`, {
      action: { label: "Undo", onClick: () => restoreIssues(deleted) },
    })
  }

  return (
    <>
      <button
        className="h-8 rounded-full px-3 text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-600 flex items-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onClick={handleDelete}
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} className="mr-1.5" />
        Delete
      </button>
      <button
        className="h-8 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground flex items-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon icon={CommandIcon} size={14} className="mr-1.5" />
        Actions
      </button>
    </>
  )
}

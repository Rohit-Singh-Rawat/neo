"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { SelectionActionBar } from "@/components/design-system/selection-action-bar"
import { useDocumentKeyDown } from "@/hooks/use-document-keydown"
import { cn } from "@/lib/utils"

interface DataListContextValue {
  focusedId: string | null
  /** Which row should carry `tabIndex={0}` — `focusedId` once something has
   * been focused, otherwise the first row, so Tab can always reach the list. */
  tabbableId: string | null
  setFocusedId: (id: string | null) => void
  selectedIds: Set<string>
  toggleSelected: (id: string, checked: boolean) => void
  toggleAll: (checked: boolean) => void
  clearSelection: () => void
  isAllSelected: boolean
  collapsedGroups: Set<string>
  toggleGroup: (groupKey: string) => void
}

const DataListContext = createContext<DataListContextValue | null>(null)

/** Access selection, focus, and group state from any DataList descendant. */
function useDataList() {
  const ctx = useContext(DataListContext)
  if (!ctx) throw new Error("DataList components must be rendered inside <DataList.Root>")
  return ctx
}

interface DataListRootProps {
  itemIds: string[]
  onItemAction?: (id: string) => void
  onSelectionChange?: (selectedIds: Set<string>, clearSelection: () => void) => void
  initialCollapsedGroups?: string[]
  children: React.ReactNode
  className?: string
}

/**
 * Context provider for a selectable, keyboard-navigable, groupable list.
 * Keyboard nav uses DOM queries on `[data-list-item-id]` so collapsed-group
 * children (which unmount) are automatically excluded from the traversal.
 */
function Root({
  itemIds,
  onItemAction,
  onSelectionChange,
  initialCollapsedGroups,
  children,
  className,
}: DataListRootProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(initialCollapsedGroups)
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const hasMounted = useRef(false)
  // Hover also sets `focusedId` (for the visual highlight), but only keyboard nav should
  // move real DOM focus — this flag tells the effect below which kind of change just happened.
  const focusFromKeyboard = useRef(false)

  const isAllSelected =
    itemIds.length > 0 && itemIds.every((id) => selectedIds.has(id))

  // Falls back to the first row whenever nothing focused is currently visible
  // (nothing focused yet, or the focused row was filtered/grouped away) —
  // without this, no row ever carries tabIndex={0} and Tab can't reach the list.
  const tabbableId = (focusedId && itemIds.includes(focusedId) ? focusedId : itemIds[0]) ?? null

  function getVisibleIds(): string[] {
    if (!containerRef.current) return []
    const rows = containerRef.current.querySelectorAll<HTMLElement>("[data-list-item-id]")
    return Array.from(rows).map((el) => el.dataset.listItemId!)
  }

  function setFocusedIdFromKeyboard(id: string | null) {
    focusFromKeyboard.current = true
    setFocusedId(id)
  }

  // Keyboard nav moves `focusedId` but never touches the DOM directly, so without this
  // the visible focus ring stays on whatever was last tabbed/clicked to. Skip the first
  // run so mounting the list doesn't steal focus from wherever the page already put it,
  // and skip hover-driven changes so mousing over a row doesn't steal real focus.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    if (!focusFromKeyboard.current) return
    focusFromKeyboard.current = false
    if (!focusedId || !containerRef.current) return
    containerRef.current
      .querySelector<HTMLElement>(`[data-list-item-id="${focusedId}"]`)
      ?.focus()
  }, [focusedId])

  useDocumentKeyDown((event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter") return
    // Only hijack arrow/enter keys when focus is genuinely inside this list — otherwise
    // this listener (mounted document-wide) would steal navigation from the rest of the page.
    if (!containerRef.current?.contains(document.activeElement)) return

    const visibleIds = getVisibleIds()
    if (visibleIds.length === 0) return
    // Read the real DOM-focused row rather than `focusedId` — hovering a
    // different row updates `focusedId` for the highlight without moving
    // real focus, and navigation must continue from where focus actually is.
    const activeId = (document.activeElement as HTMLElement | null)?.dataset.listItemId ?? null
    const currentIdx = activeId ? visibleIds.indexOf(activeId) : -1

    if (event.key === "ArrowDown") {
      event.preventDefault()
      const next = currentIdx < visibleIds.length - 1 ? currentIdx + 1 : currentIdx
      setFocusedIdFromKeyboard(visibleIds[next >= 0 ? next : 0])
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setFocusedIdFromKeyboard(visibleIds[currentIdx > 0 ? currentIdx - 1 : 0])
    } else if (event.key === "Enter" && onItemAction && activeId) {
      event.preventDefault()
      onItemAction(activeId)
    }
  })

  function toggleSelected(id: string, checked: boolean) {
    const next = new Set(selectedIds)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedIds(next)
    onSelectionChange?.(next, clearSelection)
  }

  function toggleAll(checked: boolean) {
    const next = checked ? new Set(itemIds) : new Set<string>()
    setSelectedIds(next)
    onSelectionChange?.(next, clearSelection)
  }

  function clearSelection() {
    setSelectedIds(new Set())
    onSelectionChange?.(new Set(), clearSelection)
  }

  function toggleGroup(groupKey: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) next.delete(groupKey)
      else next.add(groupKey)
      return next
    })
  }

  const ctx: DataListContextValue = {
    focusedId,
    tabbableId,
    setFocusedId,
    selectedIds,
    toggleSelected,
    toggleAll,
    clearSelection,
    isAllSelected,
    collapsedGroups,
    toggleGroup,
  }

  return (
    <DataListContext value={ctx}>
      <div ref={containerRef} className={cn("flex h-full flex-col", className)}>
        {children}
      </div>
    </DataListContext>
  )
}

/** Scrollable wrapper around the semantic `<table>` element. */
function Content({ children, className, tableClassName }: { children: React.ReactNode; className?: string; tableClassName?: string }) {
  return (
    <div className={cn("flex-1 overflow-auto px-2", className)}>
      <Table className={cn("border-separate border-spacing-y-px outline-none", tableClassName ?? "min-w-[800px] lg:min-w-0")}>
        {children}
      </Table>
    </div>
  )
}

/** Optional `<thead>` row. Omit for headerless lists (e.g. Issues). */
function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <TableHeader
      className={cn(
        "[&_tr]:border-0 bg-muted [&>tr>th:first-child]:rounded-l-md [&>tr>th:last-child]:rounded-r-md",
        className
      )}
    >
      <TableRow className="border-0">{children}</TableRow>
    </TableHeader>
  )
}

/** Select-all checkbox wired to context. Renders inside a `<th>` cell. */
function SelectAll(props: Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange">) {
  const { isAllSelected, toggleAll } = useDataList()
  return (
    <TableHead className="w-9">
      <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} {...props} />
    </TableHead>
  )
}

/** `<tbody>` that clears row focus when the mouse leaves the list area. */
function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  const { setFocusedId } = useDataList()
  return (
    <TableBody onMouseLeave={() => setFocusedId(null)} className={className}>
      {children}
    </TableBody>
  )
}

interface DataListRowProps extends Omit<React.ComponentProps<typeof TableRow>, "children"> {
  itemId: string
  children: React.ReactNode
}

/**
 * Focusable, selectable table row. Sets `data-list-item-id` for keyboard nav
 * discovery and `group/row` so descendants can use `group-hover/row:…` utilities.
 */
function Row({ itemId, children, className, ...props }: DataListRowProps) {
  const { focusedId, tabbableId, setFocusedId, selectedIds } = useDataList()
  const isSelected = selectedIds.has(itemId)

  return (
    <TableRow
      data-list-item-id={itemId}
      tabIndex={tabbableId === itemId ? 0 : -1}
      onMouseEnter={() => setFocusedId(itemId)}
      onFocus={() => setFocusedId(itemId)}
      className={cn(
        "group/row border-0 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md h-9 transition-colors outline-none",
        focusedId === itemId && !isSelected && "bg-accent",
        isSelected && (focusedId === itemId ? "bg-ring/10" : "bg-ring/5"),
        className
      )}
      {...props}
    >
      {children}
    </TableRow>
  )
}

interface DataListSelectionProps
  extends Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange"> {
  itemId: string
  cellClassName?: string
}

/** Per-row selection checkbox, auto-wired to context. */
function Selection({ itemId, cellClassName, ...checkboxProps }: DataListSelectionProps) {
  const { selectedIds, toggleSelected } = useDataList()
  return (
    <TableCell className={cn("w-9", cellClassName)}>
      <Checkbox
        checked={selectedIds.has(itemId)}
        onCheckedChange={(checked: boolean) => toggleSelected(itemId, checked)}
        {...checkboxProps}
      />
    </TableCell>
  )
}

interface DataListGroupProps {
  groupKey: string
  title?: string
  count: number
  icon?: React.ReactNode
  /** Slot at the right edge, visible on hover (e.g. a "+" button). */
  headerAction?: React.ReactNode
  colSpan?: number
  children: React.ReactNode
}

/** Collapsible group header. Children unmount when collapsed. */
function Group({
  groupKey,
  title,
  count,
  icon,
  headerAction,
  colSpan = 20,
  children,
}: DataListGroupProps) {
  const { collapsedGroups, toggleGroup } = useDataList()
  const isCollapsed = collapsedGroups.has(groupKey)

  return (
    <>
      <TableRow className="group/group-header border-0 bg-muted/30 h-9 transition-colors hover:bg-muted/50 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md">
        <TableCell colSpan={colSpan + 1} className="p-0">
          <div className="flex w-full items-center gap-2 p-2">
            <button
              type="button"
              aria-expanded={!isCollapsed}
              onClick={() => toggleGroup(groupKey)}
              className="flex flex-1 items-center gap-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <HugeiconsIcon
                icon={isCollapsed ? ArrowRight01Icon : ArrowDown01Icon}
                size={12}
                strokeWidth={2}
                className="mx-1.5 text-muted-foreground"
              />
              {icon}
              {title && <span className="text-sm font-semibold text-foreground">{title}</span>}
              <span className="text-xs text-muted-foreground font-medium">{count}</span>
            </button>
            {headerAction && (
              <span className="opacity-0 group-hover/group-header:opacity-100 group-focus-within/group-header:opacity-100 transition-opacity">
                {headerAction}
              </span>
            )}
          </div>
        </TableCell>
      </TableRow>
      {!isCollapsed && children}
    </>
  )
}

/** Bottom bar that appears when ≥1 row is selected. */
function ActionBar({ children }: { children?: React.ReactNode | ((ctx: { selectedIds: Set<string>; clearSelection: () => void }) => React.ReactNode) }) {
  const { selectedIds, clearSelection } = useDataList()
  const count = selectedIds.size
  return (
    <SelectionActionBar count={count} onClear={clearSelection}>
      {typeof children === "function" ? children({ selectedIds, clearSelection }) : children}
    </SelectionActionBar>
  )
}

const Cell = TableCell
const HeadCell = TableHead

export const DataList = {
  Root,
  Content,
  Header,
  SelectAll,
  Body,
  Row,
  Selection,
  Group,
  ActionBar,
  Cell,
  HeadCell,
}

export { useDataList }

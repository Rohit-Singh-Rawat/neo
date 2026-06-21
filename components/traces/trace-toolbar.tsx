"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterMailIcon,
  Task01Icon,
  RobotIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveFilterMenu } from "@/components/ui/responsive-filter-menu";
import { DisplayPropertiesMenu } from "@/components/design-system/display-properties-menu";
import { StatusIndicator } from "@/components/design-system/status-indicator";
import { useDocumentKeyDown } from "@/hooks/use-document-keydown";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusValue = "all" | "success" | "error" | "running";
type SortValue = "newest" | "oldest" | "cost" | "latency";
export type OptionalColumn = "id" | "tags" | "model" | "feedback";

const optionalColumns: { key: OptionalColumn; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "tags", label: "Tags" },
  { key: "model", label: "Model" },
  { key: "feedback", label: "Feedback" },
];

type TraceToolbarProps = {
  currentQuery: string;
  currentStatus: StatusValue;
  currentSort: SortValue;
  currentGroup: boolean;
  currentColumns: OptionalColumn[];
  /** Currently active model filter (empty string = no filter) */
  currentModel: string;
  /** Currently active tag filters */
  currentTags: string[];
  /** All distinct model names in the dataset */
  availableModels: string[];
  /** All distinct tag values in the dataset */
  availableTags: string[];
  className?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

/** Traces page toolbar — search, filter dropdown (status / model / tags), and display-properties menu. */
export function TraceToolbar({
  currentQuery,
  currentStatus,
  currentSort,
  currentGroup,
  currentColumns,
  currentModel,
  currentTags,
  availableModels,
  availableTags,
  className,
}: TraceToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(currentQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Controlled open state so the F keyboard shortcut can programmatically open the menu
  const [filterOpen, setFilterOpen] = useState(false);

  // `/` → focus search   |   `F` → open filter dropdown
  useDocumentKeyDown((event) => {
    if (event.key === "/") {
      event.preventDefault();
      inputRef.current?.focus();
    }
    if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      setFilterOpen((prev) => !prev);
    }
  });

  // ── URL navigation helpers ─────────────────────────────────────────────────

  function navigate(next: {
    q?: string;
    status?: StatusValue;
    sort?: SortValue;
    group?: boolean;
    columns?: OptionalColumn[];
    model?: string;
    tags?: string[];
  }) {
    const params = new URLSearchParams();
    const q       = next.q       ?? query;
    const status  = next.status  ?? currentStatus;
    const sort    = next.sort    ?? currentSort;
    const group   = next.group   ?? currentGroup;
    const columns = next.columns ?? currentColumns;
    const model   = next.model   !== undefined ? next.model  : currentModel;
    const tags    = next.tags    !== undefined ? next.tags   : currentTags;

    if (q)                  params.set("q",      q);
    if (status !== "all")   params.set("status", status);
    if (sort   !== "newest")params.set("sort",   sort);
    if (group)              params.set("group",  "status");
    if (columns.length > 0) params.set("cols",   columns.join(","));
    if (model)              params.set("model",  model);
    if (tags.length > 0)    params.set("tags",   tags.join(","));

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  }

  function toggleColumn(key: OptionalColumn, visible: boolean) {
    const next = visible
      ? [...currentColumns, key]
      : currentColumns.filter((c) => c !== key);
    navigate({ columns: next });
  }

  // Count active filters for the badge on the filter button
  const activeFilterCount =
    (currentStatus !== "all" ? 1 : 0) +
    (currentModel ? 1 : 0) +
    currentTags.length;

  return (
    <div className={cn("flex items-center justify-between gap-3 w-full", className)}>
      <Input
        key={currentQuery}
        ref={inputRef}
        aria-label="Search traces"
        placeholder="Search traces…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          navigate({ q: event.target.value });
        }}
        className="h-8 w-full sm:max-w-xs border border-border/50 dark:border-border bg-transparent px-4 shadow-none focus-visible:ring-1"
      />

      <div className="flex items-center gap-1.5 shrink-0">
        {/* ── Filter dropdown ──────────────────────────────────────────────── */}
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
              onChange: (value) => navigate({ status: value as StatusValue }),
              options: [
                { label: "All", value: "all" },
                ...( ["success", "error", "running"] as const ).map((s) => ({
                  label: (
                    <span className="flex items-center gap-1.5">
                      <StatusIndicator status={s} />
                      <span className="capitalize">{s}</span>
                    </span>
                  ),
                  value: s,
                })),
              ],
            },
            ...(availableModels.length > 0 ? [{
              id: "model",
              label: "Model",
              icon: <HugeiconsIcon icon={RobotIcon} size={14} />,
              badge: currentModel || undefined,
              type: "radio" as const,
              value: currentModel || "all",
              onChange: (value: string) => navigate({ model: value === "all" ? "" : value }),
              options: [
                { label: "All models", value: "all" },
                ...availableModels.map((m) => ({
                  label: <span className="font-mono">{m}</span>,
                  value: m,
                })),
              ],
            }] : []),
            ...(availableTags.length > 0 ? [{
              id: "tags",
              label: "Tags",
              icon: <HugeiconsIcon icon={Tag01Icon} size={14} />,
              badge: currentTags.length > 0 ? currentTags.length : undefined,
              type: "checkbox" as const,
              value: currentTags,
              onChange: (value: string[]) => navigate({ tags: value }),
              options: availableTags.map((t) => ({ label: t, value: t })),
            }] : []),
          ]}
          activeFilterCount={activeFilterCount}
          onClearAll={() => navigate({ status: "all", model: "", tags: [] })}
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-full border-border/50 dark:border-border bg-background hover:bg-muted/50"
            >
              <HugeiconsIcon icon={FilterMailIcon} strokeWidth={1.5} size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-ring ring-1 ring-background shadow-sm" />
              )}
              <span className="sr-only">Filter</span>
            </Button>
          }
        />

        {/* ── Display / View properties ─────────────────────────────────── */}
        <DisplayPropertiesMenu
          columns={optionalColumns}
          visible={currentColumns}
          onToggle={toggleColumn}
          onReset={() =>
            navigate({
              q: "",
              status: "all",
              sort: "newest",
              group: false,
              columns: [],
              model: "",
              tags: [],
            })
          }
          sortValue={currentSort}
          onSortChange={(value) => {
            if (value) navigate({ sort: value as SortValue });
          }}
          sortOptions={[
            { value: "newest",  label: "Newest first" },
            { value: "oldest",  label: "Oldest first" },
            { value: "cost",    label: "Highest cost" },
            { value: "latency", label: "Highest latency" },
          ]}
          groupValue={currentGroup ? "status" : "none"}
          onGroupChange={(value) => {
            if (value) navigate({ group: value === "status" });
          }}
          groupOptions={[
            { value: "none",   label: "No grouping" },
            { value: "status", label: "Status" },
          ]}
        />
      </div>
    </div>
  );
}

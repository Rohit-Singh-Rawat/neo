"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterMailIcon,
  Task01Icon,
  RobotIcon,
  Tag01Icon,
  CheckmarkSquare02Icon,
  Square01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // `/` → focus search   |   `F` → open filter dropdown
  useDocumentKeyDown((event) => {
    // Don't fire when the user is typing inside an input / textarea
    const tag = (event.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

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

  /** Toggle a tag in/out of the active tags filter */
  function toggleTag(tag: string) {
    const next = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    navigate({ tags: next });
  }

  // Count active filters for the badge on the filter button
  const activeFilterCount =
    (currentStatus !== "all" ? 1 : 0) +
    (currentModel ? 1 : 0) +
    currentTags.length;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <Input
        ref={inputRef}
        aria-label="Search traces"
        placeholder="Search traces…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          navigate({ q: event.target.value });
        }}
        className="h-8 max-w-xs border border-border/50 bg-transparent px-4 shadow-none focus-visible:ring-1"
      />

      <div className="flex items-center gap-1.5">
        {/* ── Filter dropdown ──────────────────────────────────────────────── */}
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="relative h-7 w-7 rounded-full border-border/50 bg-background hover:bg-muted/50"
              />
            }
          >
            <HugeiconsIcon icon={FilterMailIcon} strokeWidth={1.5} size={14} />
            {/* Active filter badge */}
            {activeFilterCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-sky-500 ring-1 ring-background shadow-sm" />
            )}
            <span className="sr-only">Filter</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[220px] p-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium">Add Filter</span>
              <kbd className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium leading-none">
                F
              </kbd>
            </div>

            <div className="p-1">
              {/* Status sub-menu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-xs">
                  <HugeiconsIcon icon={Task01Icon} size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1">Status</span>
                  {currentStatus !== "all" && (
                    <span className="ml-2 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground capitalize">
                      {currentStatus}
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[180px]">
                  <DropdownMenuRadioGroup
                    value={currentStatus}
                    onValueChange={(value) => navigate({ status: value as StatusValue })}
                  >
                    <DropdownMenuRadioItem value="all" className="text-xs">
                      All
                    </DropdownMenuRadioItem>
                    {(["success", "error", "running"] as const).map((s) => (
                      <DropdownMenuRadioItem key={s} value={s} className="text-xs">
                        <StatusIndicator status={s} />
                        <span className="ml-1.5 capitalize">{s}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Model sub-menu — radio: one model or none */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="text-xs"
                  disabled={availableModels.length === 0}
                >
                  <HugeiconsIcon icon={RobotIcon} size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1">Model</span>
                  {currentModel && (
                    <span className="ml-2 max-w-[70px] truncate rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                      {currentModel}
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={currentModel || "all"}
                    onValueChange={(value) =>
                      navigate({ model: value === "all" ? "" : value })
                    }
                  >
                    <DropdownMenuRadioItem value="all" className="text-xs">
                      All models
                    </DropdownMenuRadioItem>
                    {availableModels.map((m) => (
                      <DropdownMenuRadioItem key={m} value={m} className="font-mono text-xs">
                        {m}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Tags sub-menu — multi-select checkboxes */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="text-xs"
                  disabled={availableTags.length === 0}
                >
                  <HugeiconsIcon icon={Tag01Icon} size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1">Tags</span>
                  {currentTags.length > 0 && (
                    <span className="ml-2 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                      {currentTags.length}
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[200px]">
                  {availableTags.map((tag) => {
                    const checked = currentTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={checked}
                        onClick={() => toggleTag(tag)}
                        className="flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-xs outline-none hover:bg-accent focus:bg-accent"
                      >
                        <HugeiconsIcon
                          icon={checked ? CheckmarkSquare02Icon : Square01Icon}
                          size={13}
                          strokeWidth={1.5}
                          className={checked ? "text-primary" : "text-muted-foreground"}
                        />
                        {tag}
                      </button>
                    );
                  })}
                  {currentTags.length > 0 && (
                    <>
                      <div className="my-1 border-t border-border/50" />
                      <button
                        type="button"
                        onClick={() => navigate({ tags: [] })}
                        className="flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-xs text-muted-foreground outline-none hover:bg-accent focus:bg-accent"
                      >
                        Clear tag filters
                      </button>
                    </>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </div>

            {/* Active filters summary + clear */}
            {activeFilterCount > 0 && (
              <div className="border-t border-border/50 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => navigate({ status: "all", model: "", tags: [] })}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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

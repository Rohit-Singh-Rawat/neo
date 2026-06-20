"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ThumbsUpIcon, ThumbsDownIcon } from "@hugeicons/core-free-icons";
import { StatusIndicator } from "@/components/design-system/status-indicator";
import { SelectionActionBar } from "@/components/design-system/selection-action-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDocumentKeyDown } from "@/hooks/use-document-keydown";
import { formatCurrency, formatDuration, formatTimestamp, formatTokenCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Trace } from "@/lib/data/schemas";
import type { OptionalColumn } from "./trace-toolbar";

type TraceTableProps = {
  traces: Trace[];
  visibleColumns: OptionalColumn[];
  groupByStatus: boolean;
};

function rootLatencyMs(trace: Trace): number | undefined {
  return trace.spans.find((span) => span.parentId === null)?.latencyMs;
}

function modelsUsed(trace: Trace): string {
  const models = new Set<string>();
  for (const span of trace.spans) {
    if (span.type === "llm" && span.model) {
      models.add(span.model);
    }
  }
  return models.size > 0 ? Array.from(models).join(", ") : "—";
}

const statusGroupOrder = ["error", "running", "success"] as const;

export function TraceTable({ traces, visibleColumns, groupByStatus }: TraceTableProps) {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useDocumentKeyDown((event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, traces.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      setFocusedIndex((current) => {
        const trace = traces[current];
        if (trace) router.push(`/traces/${trace.id}`);
        return current;
      });
    }
  });

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleGroup(status: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  const allSelected = traces.length > 0 && traces.every((trace) => selected.has(trace.id));

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(traces.map((trace) => trace.id)) : new Set());
  }

  function renderRow(trace: Trace, index: number) {
    const latencyMs = rootLatencyMs(trace);
    return (
      <TableRow
        key={trace.id}
        onMouseEnter={() => setFocusedIndex(index)}
        className={cn(
          "border-0 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md",
          index === focusedIndex && "bg-accent"
        )}
      >
        <TableCell className="w-9">
          <Checkbox
            checked={selected.has(trace.id)}
            onCheckedChange={(checked: boolean) => toggleRow(trace.id, checked)}
            aria-label={`Select ${trace.name}`}
          />
        </TableCell>
        {visibleColumns.includes("id") && (
          <TableCell className="font-mono text-xs text-muted-foreground">{trace.id}</TableCell>
        )}
        <TableCell>
          <Link href={`/traces/${trace.id}`} className="block">
            <div className="font-medium text-sm truncate max-w-[200px] xl:max-w-[400px]">{trace.name}</div>
          </Link>
        </TableCell>

        <TableCell>
          <StatusIndicator status={trace.status} />
        </TableCell>
        <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatTimestamp(trace.startTime)}
        </TableCell>
        <TableCell className="text-right font-mono text-xs tabular-nums">
          {latencyMs ? formatDuration(latencyMs) : "—"}
        </TableCell>
        <TableCell className="text-right font-mono text-xs tabular-nums">{formatTokenCount(trace.totalTokens)}</TableCell>
        <TableCell className="text-right font-mono text-xs tabular-nums">{formatCurrency(trace.totalCostUsd)}</TableCell>

        {visibleColumns.includes("tags") && (
          <TableCell className="text-xs text-muted-foreground">{trace.tags.join(", ") || "—"}</TableCell>
        )}
        {visibleColumns.includes("model") && (
          <TableCell className="text-right font-mono text-xs text-muted-foreground">{modelsUsed(trace)}</TableCell>
        )}
        {visibleColumns.includes("feedback") && (
          <TableCell className="text-center">
            {trace.feedback ? (
              <div className="flex justify-center text-muted-foreground">
                <HugeiconsIcon 
                  icon={trace.feedback.rating === "up" ? ThumbsUpIcon : ThumbsDownIcon} 
                  size={14} 
                  strokeWidth={2}
                />
              </div>
            ) : "—"}
          </TableCell>
        )}
      </TableRow>
    );
  }

  const groups = groupByStatus
    ? statusGroupOrder
        .map((status) => ({ status, traces: traces.filter((trace) => trace.status === status) }))
        .filter((group) => group.traces.length > 0)
    : [{ status: null, traces }];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-2">
        <Table className="border-separate border-spacing-y-px outline-none">
          <TableHeader className="[&_tr]:border-0 bg-muted [&>tr>th:first-child]:rounded-l-md [&>tr>th:last-child]:rounded-r-md">
            <TableRow className="border-0">
              <TableHead className="w-9">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all traces" />
              </TableHead>
              {visibleColumns.includes("id") && (
                <TableHead className="text-xs font-medium text-muted-foreground">ID</TableHead>
              )}
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Started</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">Latency</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">Tokens</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">Cost</TableHead>
              {visibleColumns.includes("tags") && (
                <TableHead className="text-xs font-medium text-muted-foreground">Tags</TableHead>
              )}
              {visibleColumns.includes("model") && (
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Model</TableHead>
              )}
              {visibleColumns.includes("feedback") && (
                <TableHead className="text-center text-xs font-medium text-muted-foreground">Feedback</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody onMouseLeave={() => setFocusedIndex(-1)}>
            {groups.map((group) => {
              const isGroupCollapsed = group.status && collapsedGroups.has(group.status);
              return (
                <Fragment key={group.status ?? "ungrouped"}>
                  {group.status && (
                    <TableRow 
                      className="border-0 bg-muted h-10 cursor-pointer transition-colors hover:bg-muted/80 [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md"
                      onClick={() => toggleGroup(group.status!)}
                    >
                      <TableCell className="w-9 text-center p-2">
                        <HugeiconsIcon 
                          icon={ArrowRight01Icon} 
                          size={14} 
                          strokeWidth={2}
                          className={cn("mx-auto transition-transform text-muted-foreground", !isGroupCollapsed && "rotate-90")}
                        />
                      </TableCell>
                      <TableCell colSpan={6 + visibleColumns.length} className="p-2">
                        <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                          <StatusIndicator status={group.status} showLabel />
                          <span className="text-sm text-muted-foreground font-normal ml-1">{group.traces.length}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isGroupCollapsed && group.traces.map((trace) => renderRow(trace, traces.indexOf(trace)))}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <SelectionActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        actions={[
          {
            label: "Add to eval set",
            onAction: () => {
              toast.success(`Added ${selected.size} trace${selected.size === 1 ? "" : "s"} to eval set`);
              setSelected(new Set());
            },
          },
          {
            label: "Delete traces",
            onAction: () => {
              toast.success(`Deleted ${selected.size} trace${selected.size === 1 ? "" : "s"}`);
              setSelected(new Set());
            },
          },
        ]}
      />
    </div>
  );
}

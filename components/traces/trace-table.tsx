"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ThumbsUpIcon, ThumbsDownIcon } from "@hugeicons/core-free-icons";
import { StatusIndicator } from "@/components/design-system/status-indicator";
import { DataList } from "@/components/design-system/data-list";
import { formatCurrency, formatDuration, formatTimestamp, formatTokenCount } from "@/lib/format";
import type { Trace } from "@/lib/data/schemas";
import type { OptionalColumn } from "./trace-toolbar";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type TraceTableProps = {
  traces: Trace[];
  visibleColumns: OptionalColumn[];
  groupByStatus: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

/** Traces list — consumes the shared DataList system for selection, keyboard nav, and grouping. */
export function TraceTable({ traces, visibleColumns, groupByStatus }: TraceTableProps) {
  const router = useRouter();

  const groups = groupByStatus
    ? statusGroupOrder
        .map((status) => ({ status, traces: traces.filter((t) => t.status === status) }))
        .filter((g) => g.traces.length > 0)
    : [{ status: null as string | null, traces }];

  function renderRow(trace: Trace) {
    const latencyMs = rootLatencyMs(trace);
    return (
      <DataList.Row key={trace.id} itemId={trace.id}>
        <DataList.Selection itemId={trace.id} aria-label={`Select ${trace.name}`} />
        {visibleColumns.includes("id") && (
          <DataList.Cell className="font-mono text-xs text-muted-foreground">{trace.id}</DataList.Cell>
        )}
        <DataList.Cell>
          <Link href={`/traces/${trace.id}`} className="block">
            <div className="font-medium text-sm truncate max-w-[200px] md:max-w-[240px] xl:max-w-[280px]">{trace.name}</div>
          </Link>
        </DataList.Cell>
        <DataList.Cell>
          <StatusIndicator status={trace.status} />
        </DataList.Cell>
        <DataList.Cell className="font-mono text-xs tabular-nums text-muted-foreground whitespace-nowrap">
          {formatTimestamp(trace.startTime)}
        </DataList.Cell>
        <DataList.Cell className="text-right font-mono text-xs tabular-nums whitespace-nowrap">
          {latencyMs ? formatDuration(latencyMs) : "—"}
        </DataList.Cell>
        <DataList.Cell className="text-right font-mono text-xs tabular-nums whitespace-nowrap">
          {formatTokenCount(trace.totalTokens)}
        </DataList.Cell>
        <DataList.Cell className="text-right font-mono text-xs tabular-nums whitespace-nowrap">
          {formatCurrency(trace.totalCostUsd)}
        </DataList.Cell>
        {visibleColumns.includes("tags") && (
          <DataList.Cell className="text-xs text-muted-foreground truncate">
            {trace.tags.join(", ") || "—"}
          </DataList.Cell>
        )}
        {visibleColumns.includes("model") && (
          <DataList.Cell className="text-right font-mono text-xs text-muted-foreground truncate">
            {modelsUsed(trace)}
          </DataList.Cell>
        )}
        {visibleColumns.includes("feedback") && (
          <DataList.Cell className="text-center">
            {trace.feedback ? (
              <div className="flex justify-center text-muted-foreground">
                <HugeiconsIcon
                  icon={trace.feedback.rating === "up" ? ThumbsUpIcon : ThumbsDownIcon}
                  size={14}
                  strokeWidth={2}
                />
              </div>
            ) : (
              "—"
            )}
          </DataList.Cell>
        )}
      </DataList.Row>
    );
  }

  return (
    <DataList.Root
      itemIds={traces.map((t) => t.id)}
      onItemAction={(id) => router.push(`/traces/${id}`)}
    >
      <DataList.Content tableClassName="w-full">
        <DataList.Header>
          <DataList.SelectAll aria-label="Select all traces" />
          {visibleColumns.includes("id") && (
            <DataList.HeadCell className="text-xs font-medium text-muted-foreground">ID</DataList.HeadCell>
          )}
          <DataList.HeadCell className="text-xs font-medium text-muted-foreground">Name</DataList.HeadCell>
          <DataList.HeadCell className="text-xs font-medium text-muted-foreground">Status</DataList.HeadCell>
          <DataList.HeadCell className="text-xs font-medium text-muted-foreground">Started</DataList.HeadCell>
          <DataList.HeadCell className="text-right text-xs font-medium text-muted-foreground">Latency</DataList.HeadCell>
          <DataList.HeadCell className="text-right text-xs font-medium text-muted-foreground">Tokens</DataList.HeadCell>
          <DataList.HeadCell className="text-right text-xs font-medium text-muted-foreground">Cost</DataList.HeadCell>
          {visibleColumns.includes("tags") && (
            <DataList.HeadCell className="text-xs font-medium text-muted-foreground">Tags</DataList.HeadCell>
          )}
          {visibleColumns.includes("model") && (
            <DataList.HeadCell className="text-right text-xs font-medium text-muted-foreground">Model</DataList.HeadCell>
          )}
          {visibleColumns.includes("feedback") && (
            <DataList.HeadCell className="text-center text-xs font-medium text-muted-foreground">Feedback</DataList.HeadCell>
          )}
        </DataList.Header>

        <DataList.Body>
          {groups.map((group) => (
            <Fragment key={group.status ?? "ungrouped"}>
              {group.status ? (
                <DataList.Group
                  groupKey={group.status}
                  count={group.traces.length}
                  icon={<StatusIndicator status={group.status as "success" | "error" | "running"} showLabel />}
                >
                  {group.traces.map((trace) => renderRow(trace))}
                </DataList.Group>
              ) : (
                group.traces.map((trace) => renderRow(trace))
              )}
            </Fragment>
          ))}
        </DataList.Body>
      </DataList.Content>

      <DataList.ActionBar>
        {({ selectedIds, clearSelection }) => (
          <div className="flex items-center gap-2 pr-1">
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs px-3 shadow-none bg-muted/50 hover:bg-muted"
              onClick={() => {
                toast.success(`Added ${selectedIds.size} trace${selectedIds.size === 1 ? "" : "s"} to eval set`);
                clearSelection();
              }}
            >
              Add to eval set
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs px-3 shadow-none"
              onClick={() => {
                toast.success(`Deleted ${selectedIds.size} trace${selectedIds.size === 1 ? "" : "s"}`);
                clearSelection();
              }}
            >
              Delete traces
            </Button>
          </div>
        )}
      </DataList.ActionBar>
    </DataList.Root>
  );
}

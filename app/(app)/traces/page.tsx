import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle, EmptyMedia } from "@/components/ui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { TraceToolbar, type OptionalColumn } from "@/components/traces/trace-toolbar";
import { TraceTable } from "@/components/traces/trace-table";
import { filterTraces, getTraces, getUniqueModels, getUniqueTags, sortTraces, type TraceSort } from "@/lib/data/traces";

type TracesPageProps = {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; group?: string; cols?: string; model?: string; tags?: string }>;
};

function parseStatus(value: string | undefined): "success" | "error" | "running" | undefined {
  return value === "success" || value === "error" || value === "running" ? value : undefined;
}

function parseSort(value: string | undefined): TraceSort {
  return value === "oldest" || value === "cost" || value === "latency" ? value : "newest";
}

function parseColumns(value: string | undefined): OptionalColumn[] {
  if (!value) return [];
  return value.split(",").filter((c): c is OptionalColumn => c === "id" || c === "tags" || c === "model" || c === "feedback");
}

export default async function TracesPage({ searchParams }: TracesPageProps) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const sort = parseSort(params.sort);
  const query = params.q ?? "";
  const group = params.group === "status";
  const columns = parseColumns(params.cols);
  const model = params.model ?? undefined;
  const tags = params.tags ? params.tags.split(",").filter(Boolean) : [];

  const allTraces = getTraces();
  const availableModels = getUniqueModels(allTraces);
  const availableTags = getUniqueTags(allTraces);
  const traces = sortTraces(filterTraces(allTraces, { query, status, model, tags }), sort);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <TraceToolbar
          currentQuery={query}
          currentStatus={status ?? "all"}
          currentSort={sort}
          currentGroup={group}
          currentColumns={columns}
          currentModel={model ?? ""}
          currentTags={tags}
          availableModels={availableModels}
          availableTags={availableTags}
        />
      </div>
      {allTraces.length === 0 ? (
        <Empty className="flex-1">
          <EmptyHeader>
            <EmptyMedia variant="icon"><HugeiconsIcon icon={Activity01Icon} /></EmptyMedia>
            <EmptyTitle>No traces yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t recorded any traces. Integrate the SDK to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>View documentation</Button>
          </EmptyContent>
        </Empty>
      ) : traces.length === 0 ? (
        <Empty className="flex-1">
          <EmptyHeader>
            <EmptyMedia variant="icon"><HugeiconsIcon icon={Search01Icon} /></EmptyMedia>
            <EmptyTitle>No matching traces</EmptyTitle>
            <EmptyDescription>
              Nothing matches the current search and filter. Try clearing them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" render={<Link href="/traces" />}>Clear filters</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <TraceTable traces={traces} visibleColumns={columns} groupByStatus={group} />
      )}
    </div>
  );
}

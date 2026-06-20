import { notFound } from "next/navigation";
import { SpanDetailPanel } from "@/components/traces/span-detail-panel";
import { SpanExplorer, type SpanView } from "@/components/traces/span-explorer";
import { TraceSummary } from "@/components/traces/trace-summary";
import { ResizableSidebar } from "@/components/layout/resizable-sidebar";
import { getTraceById } from "@/lib/data/traces";

type TraceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ span?: string; view?: string }>;
};

export default async function TraceDetailPage({ params, searchParams }: TraceDetailPageProps) {
  const [{ id }, { span: spanParam, view: viewParam }] = await Promise.all([params, searchParams]);
  const view: SpanView = viewParam === "waterfall" ? "waterfall" : "tree";

  const trace = getTraceById(id);
  if (!trace) notFound();

  const rootSpan = trace.spans.find((span) => span.parentId === null);
  const selectedSpan = trace.spans.find((span) => span.id === spanParam) ?? rootSpan;
  if (!selectedSpan) notFound();

  return (
    <div className="flex h-full flex-col">
      <TraceSummary trace={trace} />
      <div className="flex flex-1 overflow-hidden">
        <ResizableSidebar
          key={view}
          defaultWidth={view === "waterfall" ? 500 : 420}
          className="border-r border-border"
        >
          <SpanExplorer spans={trace.spans} selectedSpanId={selectedSpan.id} view={view} />
        </ResizableSidebar>
        <div className="flex-1 min-w-0 overflow-y-auto">
          <SpanDetailPanel span={selectedSpan} />
        </div>
      </div>
    </div>
  );
}

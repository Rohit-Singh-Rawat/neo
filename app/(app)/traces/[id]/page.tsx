import { notFound } from "next/navigation";
import { SpanDetailPanel } from "@/components/traces/span-detail-panel";
import { SpanExplorer, type SpanView } from "@/components/traces/span-explorer";
import { TraceSummary } from "@/components/traces/trace-summary";
import { TraceDetailLayout } from "@/components/traces/trace-detail-layout";
import { getTraceById } from "@/lib/data/traces";
import { getCardThreadByTraceId } from "@/lib/data/slack-cards";

type TraceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ span?: string; view?: string }>;
};

export default async function TraceDetailPage({ params, searchParams }: TraceDetailPageProps) {
  const [{ id }, { span: spanParam, view: viewParam }] = await Promise.all([params, searchParams]);
  const view: SpanView = viewParam === "waterfall" ? "waterfall" : "tree";

  const trace = getTraceById(id);
  if (!trace) notFound();

  const cardThread = getCardThreadByTraceId(trace.id);

  const rootSpan = trace.spans.find((span) => span.parentId === null);
  const selectedSpan = trace.spans.find((span) => span.id === spanParam) ?? rootSpan;
  if (!selectedSpan) notFound();

  return (
    <div className="flex h-full flex-col">
      <TraceSummary trace={trace} cardThread={cardThread} />
      <TraceDetailLayout
        hasSpanParam={!!spanParam}
        view={view}
        defaultSidebarWidth={view === "waterfall" ? 500 : 420}
        explorer={<SpanExplorer spans={trace.spans} selectedSpanId={selectedSpan.id} view={view} />}
        detail={<SpanDetailPanel span={selectedSpan} />}
      />
    </div>
  );
}

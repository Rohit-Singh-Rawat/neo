import { StatusIndicator } from "@/components/design-system/status-indicator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDuration, formatTokenCount } from "@/lib/format";
import type { Trace } from "@/lib/data/schemas";
import type { SlackMessage } from "@/lib/data/slack-schemas";
import { SlackCardPreview } from "@/components/slack/slack-card-preview";

type TraceSummaryProps = {
  trace: Trace;
  cardThread?: SlackMessage[];
};

function TagBadge({ tag }: { tag: string }) {
  const normalized = tag.toLowerCase();
  
  if (normalized === "staging") {
    return (
      <Badge variant="outline" className="text-foreground">
        <span className="mr-1.5 size-2 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
        {tag}
      </Badge>
    );
  }
  
  if (normalized === "production") {
    return (
      <Badge variant="outline" className="text-foreground">
        <span className="mr-1.5 size-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
        {tag}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <span className="mr-1.5 text-muted-foreground/50" aria-hidden="true">#</span>
      {tag}
    </Badge>
  );
}

export function TraceSummary({ trace, cardThread }: TraceSummaryProps) {
  const rootSpan = trace.spans.find((span) => span.parentId === null);

  return (
    <div className="border-b border-border px-6 py-4">
      <div className="flex w-full min-w-0 items-center justify-between">
        <div className="min-w-0 flex-1 mr-4">
          <h1 className="text-lg font-medium tracking-tight truncate" title={trace.name}>{trace.name}</h1>
          <p className="font-mono text-xs text-muted-foreground truncate" title={trace.id}>{trace.id}</p>
        </div>
        <StatusIndicator status={trace.status} showLabel />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span className="font-mono tabular-nums text-muted-foreground">
          {rootSpan?.latencyMs ? formatDuration(rootSpan.latencyMs) : "—"}
        </span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {formatTokenCount(trace.totalTokens)} tokens
        </span>
        <span className="font-mono tabular-nums text-muted-foreground">{formatCurrency(trace.totalCostUsd)}</span>
        <div className="flex flex-wrap items-center gap-2 ml-2">
          {trace.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {cardThread && (
            <SlackCardPreview thread={cardThread} />
          )}
        </div>
      </div>

    </div>
  );
}

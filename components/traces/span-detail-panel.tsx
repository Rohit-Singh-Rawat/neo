import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, BrainIcon, Clock01Icon, CoinsDollarIcon, Database01Icon } from "@hugeicons/core-free-icons";
import { InfoBadge } from "@/components/design-system/info-badge";
import { StatusIndicator } from "@/components/design-system/status-indicator";
import { CollapsibleSection } from "@/components/traces/collapsible-section";
import { LlmMessageView } from "@/components/traces/llm-message-view";
import { formatCurrency, formatDuration, formatTokenCount } from "@/lib/format";
import type { Span } from "@/lib/data/schemas";

type SpanDetailPanelProps = {
  span: Span;
};

export function SpanDetailPanel({ span }: SpanDetailPanelProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 p-4">
      <div className="flex w-full min-w-0 items-center justify-between">
        <div className="min-w-0 flex-1 mr-4">
          <h2 className="font-medium truncate" title={span.name}>{span.name}</h2>
          <p className="font-mono text-xs text-muted-foreground truncate" title={span.id}>{span.id}</p>
        </div>
        <StatusIndicator status={span.status} showLabel />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {span.latencyMs !== undefined && <InfoBadge icon={Clock01Icon} label={formatDuration(span.latencyMs)} />}
        {span.type === "llm" && span.model && <InfoBadge icon={BrainIcon} label={span.model} />}
        {span.type === "llm" && span.promptTokens !== undefined && span.completionTokens !== undefined && (
          <InfoBadge
            icon={Database01Icon}
            label={`${formatTokenCount(span.promptTokens)} → ${formatTokenCount(span.completionTokens)}`}
          />
        )}
        {span.type === "llm" && span.costUsd !== undefined && <InfoBadge icon={CoinsDollarIcon} label={formatCurrency(span.costUsd)} />}
      </div>

      {span.error && (
        <div className="flex gap-2.5 text-sm text-destructive mt-1 px-1">
          <HugeiconsIcon icon={Alert01Icon} className="shrink-0 mt-0.5" size={16} strokeWidth={2} />
          <div className="leading-relaxed font-medium">{span.error}</div>
        </div>
      )}

      <CollapsibleSection title="Input">
        <LlmMessageView value={span.input} />
      </CollapsibleSection>
      <CollapsibleSection title="Output">
        <LlmMessageView value={span.output} />
      </CollapsibleSection>
    </div>
  );
}

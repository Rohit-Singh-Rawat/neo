import type { KnownBlock } from "@/lib/data/slack-schemas";
import { Mrkdwn } from "../mrkdwn";

type ContextBlockData = Extract<KnownBlock, { type: "context" }>;

export function ContextBlock({ block }: { block: ContextBlockData }) {
  return (
    <div className="slack-context flex flex-wrap items-center gap-1.5">
      {block.elements.map((element, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && <span aria-hidden="true">·</span>}
          {element.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary external Slack avatar URL, not a local/optimizable asset
            <img src={element.image_url} alt={element.alt_text} className="size-4 rounded" />
          ) : (
            <Mrkdwn text={element.text} />
          )}
        </span>
      ))}
    </div>
  );
}

import type { KnownBlock } from "@/lib/data/slack-schemas";
import { Mrkdwn } from "../mrkdwn";

type HeaderBlockData = Extract<KnownBlock, { type: "header" }>;

export function HeaderBlock({ block }: { block: HeaderBlockData }) {
  return (
    <h3 className="slack-header">
      <Mrkdwn text={block.text.text} />
    </h3>
  );
}

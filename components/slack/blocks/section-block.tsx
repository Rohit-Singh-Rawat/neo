import type { KnownBlock } from "@/lib/data/slack-schemas";
import { Mrkdwn } from "../mrkdwn";

type SectionBlockData = Extract<KnownBlock, { type: "section" }>;

export function SectionBlock({ block }: { block: SectionBlockData }) {
  return (
    <div className="space-y-2 text-sm">
      {block.text && (
        <p>
          <Mrkdwn text={block.text.text} />
        </p>
      )}
      {block.fields && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {block.fields.map((field, index) => (
            <p key={index}>
              <Mrkdwn text={field.text} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

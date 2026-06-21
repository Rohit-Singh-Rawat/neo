import type { SlackMessage } from "@/lib/data/slack-schemas";
import { BlockRenderer } from "./block-renderer";
import { cn } from "@/lib/utils";

export function SlackMessageCard({ message, muted = false, children }: { message: SlackMessage; muted?: boolean; children?: React.ReactNode }) {
  return (
    <div className={cn("slack-card p-4", muted && "opacity-70")}>
      <div className="slack-context mb-1 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded bg-[#4A154B] text-[10px] font-bold text-white"
        >
          N
        </span>
        <span className="font-medium text-[var(--slack-text)]">Neo Bot</span>
        <span>{new Date(message.postedAt).toLocaleString()}</span>
      </div>
      <BlockRenderer blocks={message.blocks} extraActions={children} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { BrainIcon, Copy01Icon, Settings01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { JsonViewer } from "@/components/json-viewer";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: string;
  content?: string | null;
  tool_calls?: { name: string }[];
};

function isChatMessage(value: unknown): value is ChatMessage {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).role === "string";
}

function extractMessages(value: unknown): ChatMessage[] | null {
  if (isChatMessage(value)) return [value];
  if (typeof value === "object" && value !== null && Array.isArray((value as Record<string, unknown>).messages)) {
    const messages = (value as { messages: unknown[] }).messages;
    if (messages.length > 0 && messages.every(isChatMessage)) return messages as ChatMessage[];
  }
  return null;
}

const roleLabel: Record<string, string> = {
  user: "User",
  assistant: "Assistant",
  system: "System",
};

const roleIcon: Record<string, IconSvgElement> = {
  user: UserIcon,
  assistant: BrainIcon,
  system: Settings01Icon,
};

const roleTextColorClassName: Record<string, string> = {
  user: "text-foreground",
  assistant: "text-warning",
  system: "text-success",
};

function MessageCard({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const icon = roleIcon[message.role] ?? UserIcon;

  function handleCopy() {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 dark:border-border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 dark:border-border bg-muted/30 px-2.5 py-1.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-md bg-muted",
              roleTextColorClassName[message.role] ?? "text-muted-foreground"
            )}
          >
            <HugeiconsIcon icon={icon} size={12} strokeWidth={2} />
          </span>
          <span className="text-xs font-medium">{roleLabel[message.role] ?? message.role}</span>
        </div>
        <div className="flex items-center gap-2">
          {copied && <span className="text-[10px] text-muted-foreground font-medium">Copied</span>}
          {message.content && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy message content"
            >
              <HugeiconsIcon icon={Copy01Icon} size={13} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
      <div className="px-3 py-2 text-sm">
        {message.content ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <p className="text-muted-foreground italic">No content</p>
        )}
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.tool_calls.map((call, callIndex) => (
              <span key={callIndex} className="rounded-md border border-border/50 dark:border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {call.name}()
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type LlmMessageViewProps = {
  value: unknown;
  className?: string;
};

/**
 * Renders a chat transcript when `value` structurally matches a single message
 * (`{role, ...}`) or a `{messages: [...]}` list; otherwise falls back to `JsonViewer`.
 * Shape-detected rather than gated on `span.type === "llm"` so a non-llm span whose
 * payload happens to look like a chat message still renders as one, and an llm span
 * with a non-chat payload still falls back cleanly.
 */
export function LlmMessageView({ value, className }: LlmMessageViewProps) {
  const messages = extractMessages(value);

  if (!messages) {
    return <JsonViewer value={value} className={className} />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {messages.map((message, index) => (
        <MessageCard key={index} message={message} />
      ))}
    </div>
  );
}

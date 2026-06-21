import rawData from "@/data/slack-cards.json";
import { SlackMessageSchema, type SlackMessage } from "./slack-schemas";

const rawMessages: unknown[] = Array.isArray((rawData as { messages?: unknown[] }).messages)
  ? (rawData as { messages: unknown[] }).messages
  : [];

// Each message is validated independently (not as one array .parse()) so a single
// malformed entry can't take down the rest of the thread list.
const messageList: SlackMessage[] = rawMessages.flatMap((raw) => {
  const result = SlackMessageSchema.safeParse(raw);
  if (!result.success) {
    console.error("Skipping malformed Slack message:", result.error.message);
    return [];
  }
  return [result.data];
});

const threadsByTraceId = new Map<string, SlackMessage[]>();
for (const message of messageList) {
  const thread = threadsByTraceId.get(message.traceId) ?? [];
  thread.push(message);
  threadsByTraceId.set(message.traceId, thread);
}
for (const thread of threadsByTraceId.values()) {
  thread.sort((a, b) => Date.parse(a.postedAt) - Date.parse(b.postedAt));
}

export function getAllThreads(): SlackMessage[][] {
  return Array.from(threadsByTraceId.values());
}

export function getCardThreadByTraceId(traceId: string): SlackMessage[] | undefined {
  return threadsByTraceId.get(traceId);
}

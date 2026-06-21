import type { ReactNode } from "react";

// Emoji codes actually present in data/slack-cards.json — not Slack's full emoji set.
const EMOJI_MAP: Record<string, string> = {
  rotating_light: "🚨",
  white_check_mark: "✅",
  mag: "🔍",
  eyes: "👀",
  warning: "⚠️",
  thumbsdown: "👎",
  red_circle: "🔴",
  large_orange_circle: "🟠",
  clock3: "🕒",
  github: "🐙",
};

// Order matters: code fences before inline code (so a fence's backticks aren't
// mis-read as inline code), everything else after. Blockquote (`> `) is in the
// data once but not in the assignment's required subset — deliberately not
// parsed, renders as literal text.
const TOKEN_PATTERN =
  /```(\w*)\n([\s\S]*?)```|`([^`]+)`|\*([^*]+)\*|(?<![\w])_([^_]+)_(?![\w])|<([^|>]+)\|([^>]+)>|:([a-z0-9_]+):|\n/g;

// Guards against `javascript:`/`data:` URIs reaching `href`. Not exploitable with
// today's static JSON data source, but this parser may eventually render live content.
function isSafeHttpUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "http:" || new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function parseMrkdwn(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const [full, , fenceBody, inlineCode, bold, italic, linkUrl, linkLabel, emojiName] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (fenceBody !== undefined) {
      nodes.push(
        <pre key={key++} className="slack-code my-1 overflow-x-auto p-2">
          <code>{fenceBody}</code>
        </pre>
      );
    } else if (inlineCode !== undefined) {
      nodes.push(
        <code key={key++} className="slack-code px-1">
          {inlineCode}
        </code>
      );
    } else if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>);
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>);
    } else if (linkUrl !== undefined) {
      nodes.push(
        isSafeHttpUrl(linkUrl) ? (
          <a key={key++} href={linkUrl} target="_blank" rel="noreferrer" className="slack-link">
            {linkLabel}
          </a>
        ) : (
          <span key={key++}>{linkLabel}</span>
        )
      );
    } else if (emojiName !== undefined) {
      nodes.push(EMOJI_MAP[emojiName] ?? `:${emojiName}:`);
    } else if (full === "\n") {
      nodes.push(<br key={key++} />);
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function Mrkdwn({ text }: { text: string }) {
  return <>{parseMrkdwn(text)}</>;
}

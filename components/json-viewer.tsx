"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { classifyJsonValue, jsonValueClassName } from "./json-viewer-utils";

function JsonNode({ value, depth }: { value: unknown; depth: number }) {
  const kind = classifyJsonValue(value);
  const [collapsed, setCollapsed] = useState(depth >= 2);
  const contentId = useId();

  if (kind === "object" || kind === "array") {
    const entries =
      kind === "array"
        ? (value as unknown[]).map((v, i) => [String(i), v] as const)
        : Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return <span className="text-muted-foreground">{kind === "array" ? "[]" : "{}"}</span>;
    }

    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-controls={contentId}
          className="text-muted-foreground hover:text-foreground"
        >
          <span aria-hidden="true">{collapsed ? "▸" : "▾"}</span>{" "}
          {kind === "array" ? `Array(${entries.length})` : `Object(${entries.length})`}
        </button>
        {!collapsed && (
          <div id={contentId} className="ml-4 border-l border-border pl-3">
            {entries.map(([key, v]) => (
              <div key={key}>
                <span className="text-muted-foreground">{key}: </span>
                <JsonNode value={v} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return (
    <span className={jsonValueClassName[kind]}>
      {kind === "string" ? `"${value as string}"` : String(value)}
    </span>
  );
}

type JsonViewerProps = {
  value: unknown;
  className?: string;
};

export function JsonViewer({ value, className }: JsonViewerProps) {
  if (value === undefined) {
    return <span className={cn("font-mono text-xs text-muted-foreground italic", className)}>none</span>;
  }
  return (
    <div className={cn("font-mono text-xs leading-relaxed px-1", className)}>
      <JsonNode value={value} depth={0} />
    </div>
  );
}

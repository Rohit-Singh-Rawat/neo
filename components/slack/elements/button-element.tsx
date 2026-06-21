"use client";

import Link from "next/link";
import { toast } from "sonner";
import type { KnownActionElement } from "@/lib/data/slack-schemas";
import { cn } from "@/lib/utils";
import { useSlackAction, type CardThreadAction } from "../slack-action-context";

type ButtonElementData = Extract<KnownActionElement, { type: "button" }>;

function slackButtonClassName(style: ButtonElementData["style"]) {
  return cn(
    "slack-button",
    style === "primary" && "slack-button--primary",
    style === "danger" && "slack-button--danger"
  );
}

// retry_run/approve_merge target a specific stage rather than "+1" because the
// real data's "investigating" stage has no actions block of its own — retrying
// surfaces the bot's full investigation (investigating + triage) at once rather
// than advancing to a stage with nothing actionable on it.
function handleAction(actionId: string, dispatch: (action: CardThreadAction) => void) {
  switch (actionId) {
    case "retry_run":
      toast.success("Retry requested — UI-only prototype, no real run was triggered.");
      dispatch({ type: "ADVANCE_TO", stage: "triage" });
      return;
    case "mute_alert":
      dispatch({ type: "MUTE" });
      return;
    case "approve_merge":
      dispatch({ type: "ADVANCE_TO", stage: "resolved" });
      return;
    case "add_to_evalset":
      toast.success("Added to eval set.");
      return;
    default:
      toast(`No handler for "${actionId}" yet.`);
  }
}

export function ButtonElement({ element }: { element: ButtonElementData }) {
  const { dispatch, traceId } = useSlackAction();
  const className = slackButtonClassName(element.style);

  if (element.action_id === "view_trace") {
    return (
      <Link href={`/traces/${traceId}`} className={className}>
        {element.text.text}
      </Link>
    );
  }

  if (element.action_id === "view_pr" && element.url) {
    return (
      <a href={element.url} target="_blank" rel="noreferrer" className={className}>
        {element.text.text}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={() => handleAction(element.action_id, dispatch)}>
      {element.text.text}
    </button>
  );
}

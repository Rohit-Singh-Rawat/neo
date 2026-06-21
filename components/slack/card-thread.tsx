"use client";

import { useReducer } from "react";
import { cn } from "@/lib/utils";
import type { SlackMessage, Lifecycle } from "@/lib/data/slack-schemas";
import {
  SlackActionProvider,
  type CardThreadState,
  type CardThreadAction,
} from "./slack-action-context";
import { SlackMessageCard } from "./slack-message";
import { CreateIssueButton } from "./elements/create-issue-button";

const STAGE_ORDER: Lifecycle[] = ["alert", "investigating", "triage", "resolved"];

function reducer(state: CardThreadState, action: CardThreadAction): CardThreadState {
  switch (action.type) {
    case "ADVANCE_TO": {
      const currentIndex = STAGE_ORDER.indexOf(state.stage);
      const targetIndex = STAGE_ORDER.indexOf(action.stage);
      return { ...state, stage: STAGE_ORDER[Math.max(currentIndex, targetIndex)] };
    }
    case "MUTE":
      return { ...state, dismissed: true };
    case "SELECT_MERGE_STRATEGY":
      return { ...state, mergeStrategy: action.value };
    case "MARK_ISSUE_CREATED":
      return { ...state, issueCreated: true };
  }
}

export function CardThread({ thread }: { thread: SlackMessage[] }) {
  const rootMessage = thread[0];
  const [state, dispatch] = useReducer(reducer, {
    stage: rootMessage.lifecycle,
    dismissed: false,
    mergeStrategy: null,
    issueCreated: false,
  });

  if (state.dismissed) {
    return <div className="slack-card p-4 text-sm text-(--slack-text-muted)">Muted.</div>;
  }

  const visibleStageIndex = STAGE_ORDER.indexOf(state.stage);
  const visibleMessages = thread.filter(
    (message) => STAGE_ORDER.indexOf(message.lifecycle) <= visibleStageIndex
  );

  return (
    <SlackActionProvider
      value={{ traceId: rootMessage.traceId, mergeStrategy: state.mergeStrategy, dispatch }}
    >
      <div className="space-y-2">
        {visibleMessages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "animate-in slide-in-from-bottom-4 fade-in duration-200 fill-mode-backwards",
              index > 0 && "ml-6 border-l border-border pl-4"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <SlackMessageCard message={message} muted={message.lifecycle === "resolved"}>
              {message.lifecycle === "alert" && (
                <CreateIssueButton
                  traceId={message.traceId}
                  title={`Investigate: ${message.scenario}`}
                  disabled={state.issueCreated}
                  onCreated={() => dispatch({ type: "MARK_ISSUE_CREATED" })}
                />
              )}
            </SlackMessageCard>
          </div>
        ))}
      </div>
    </SlackActionProvider>
  );
}

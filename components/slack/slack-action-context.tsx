"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Lifecycle } from "@/lib/data/slack-schemas";

export type CardThreadState = {
  stage: Lifecycle;
  dismissed: boolean;
  mergeStrategy: string | null;
  issueCreated: boolean;
};

export type CardThreadAction =
  | { type: "ADVANCE_TO"; stage: Lifecycle }
  | { type: "MUTE" }
  | { type: "SELECT_MERGE_STRATEGY"; value: string }
  | { type: "MARK_ISSUE_CREATED" };

type SlackActionContextValue = {
  traceId: string;
  mergeStrategy: string | null;
  dispatch: (action: CardThreadAction) => void;
};

const SlackActionContext = createContext<SlackActionContextValue | null>(null);

export function SlackActionProvider({
  value,
  children,
}: {
  value: SlackActionContextValue;
  children: ReactNode;
}) {
  return <SlackActionContext.Provider value={value}>{children}</SlackActionContext.Provider>;
}

export function useSlackAction(): SlackActionContextValue {
  const context = useContext(SlackActionContext);
  if (!context) {
    throw new Error("useSlackAction must be called within a SlackActionProvider.");
  }
  return context;
}

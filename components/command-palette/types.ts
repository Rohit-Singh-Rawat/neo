import type { ReactNode } from "react";
import type { Issue } from "@/lib/store/issues";

export type GlobalContext = {
  type: "global";
};

export type IssueContext = {
  type: "issue";
  selectedIds: Set<string>;
  selectedIssues: Issue[];
  clearSelection: () => void;
};

export type CommandContext = GlobalContext | IssueContext;

export type CommandAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
  shortcut?: string;
  group: string;
  contextTypes: CommandContext["type"][];
} & (
  | { type: "action"; perform: (ctx: CommandContext) => void }
  | { type: "page"; page: string }
);

export type CommandPage = {
  id: string;
  label: string;
  render: (ctx: CommandContext, onComplete: () => void) => ReactNode;
};

export type CommandPaletteState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  context: CommandContext;
  setContext: (ctx: CommandContext) => void;
  pages: string[];
  pushPage: (page: string) => void;
  popPage: () => void;
  resetPages: () => void;
};

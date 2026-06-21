"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDocumentKeyDown } from "@/hooks/use-document-keydown";
import { getActions } from "./registry";
import { registerGlobalActions } from "./global-actions";
import type { CommandContext, CommandPaletteState } from "./types";
import "./issue-actions";

const DEFAULT_CONTEXT: CommandContext = { type: "global" };

const CommandPaletteContext = React.createContext<CommandPaletteState | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [context, setContext] = React.useState<CommandContext>(DEFAULT_CONTEXT);
  const [pages, setPages] = React.useState<string[]>([]);

  React.useEffect(() => registerGlobalActions(router), [router]);

  const pushPage = (page: string) => setPages((prev) => [...prev, page]);
  const popPage = () => setPages((prev) => prev.slice(0, -1));
  const resetPages = () => setPages([]);

  const handleSetOpen = React.useCallback((val: boolean) => {
    setOpen(val);
    if (!val) resetPages();
  }, []);

  useDocumentKeyDown((event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      handleSetOpen(true);
      return;
    }

    // Modifier-held single letters (Ctrl+I, Alt+T, ...) are left to the
    // browser/OS, not treated as our single-letter nav shortcuts.
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const shortcutAction = getActions().find(
      (a) => a.contextTypes.includes(context.type) && a.shortcut?.toLowerCase() === event.key.toLowerCase()
    );
    if (!shortcutAction) return;

    event.preventDefault();
    if (shortcutAction.type === "page") {
      setPages([shortcutAction.page]);
      handleSetOpen(true);
    } else {
      shortcutAction.perform(context);
    }
  });

  return (
    <CommandPaletteContext
      value={{ open, setOpen: handleSetOpen, context, setContext, pages, pushPage, popPage, resetPages }}
    >
      {children}
    </CommandPaletteContext>
  );
}

export function useCommandPalette(): CommandPaletteState {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}

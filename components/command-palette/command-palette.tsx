"use client";

import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command";
import { useCommandPalette } from "./command-palette-provider";
import { getActions, getPage, subscribeToRegistry } from "./registry";
import type { CommandAction } from "./types";

export function CommandPalette() {
  const { open, setOpen, context, pages, pushPage, popPage, resetPages } = useCommandPalette();
  const [search, setSearch] = React.useState("");
  // getActions is also passed as the server snapshot — it's a pure read of a
  // plain JS Map with no browser-only API, so it's safe to call during SSR.
  const actions = React.useSyncExternalStore(subscribeToRegistry, getActions, getActions);
  const currentPageId = pages[pages.length - 1];
  const currentPage = currentPageId ? getPage(currentPageId) : undefined;

  // Reset search when navigating between palette pages. Adjusting state
  // during render (rather than in an Effect) avoids an extra commit — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevPageId, setPrevPageId] = React.useState(currentPageId);
  if (currentPageId !== prevPageId) {
    setPrevPageId(currentPageId);
    setSearch("");
  }

  const handleComplete = () => {
    setOpen(false);
    resetPages();
  };

  const groupedActions = React.useMemo(() => {
    const visible = actions.filter((a) => a.contextTypes.includes(context.type));
    const groups = new Map<string, CommandAction[]>();
    for (const action of visible) {
      const group = groups.get(action.group) ?? [];
      group.push(action);
      groups.set(action.group, group);
    }
    return groups;
  }, [actions, context.type]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette" description="Search for a command to run…">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keydown delegation wrapper for focusable descendants (CommandInput, buttons), not an interactive target itself */}
      <div
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !search && pages.length > 0) {
            e.preventDefault();
            popPage();
          } else if (e.key === "Escape" && pages.length > 0) {
            // Pop one page instead of letting the keydown reach Base UI's
            // Dialog, which would otherwise also close the whole palette on
            // the same Escape press. stopPropagation, not just preventDefault
            // — preventDefault alone doesn't stop the event from bubbling to
            // the Dialog's own Escape-to-close listener.
            e.preventDefault();
            e.stopPropagation();
            popPage();
          }
          // Escape at the root page (pages.length === 0) is left alone, so
          // Base UI's Dialog handles its own default close-on-Escape.
        }}
      >
        {(context.type === "issue" || pages.length > 0) && (
          <div className="flex items-center gap-1.5 px-4 pt-3">
            {context.type === "issue" && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {context.selectedIssues.length === 1
                  ? `${context.selectedIssues[0].id} · ${context.selectedIssues[0].title}`
                  : `${context.selectedIssues.length} issues selected`}
                <button type="button" aria-label="Clear selection" className="p-1.5 -m-1.5" onClick={() => context.clearSelection()}>
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                </button>
              </span>
            )}
            {pages.map((id) => (
              <span key={id} className="rounded-md bg-muted/60 px-2 py-1 text-xs font-medium">
                {getPage(id)?.label ?? id}
              </span>
            ))}
          </div>
        )}

        <CommandInput value={search} onValueChange={setSearch} placeholder="Type a command…" />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {!currentPage &&
            Array.from(groupedActions.entries()).map(([group, groupActions]) => (
              <CommandGroup key={group} heading={group}>
                {groupActions.map((action) => (
                  <CommandItem
                    key={action.id}
                    keywords={action.keywords}
                    onSelect={() => {
                      if (action.type === "page") {
                        pushPage(action.page);
                      } else {
                        action.perform(context);
                        handleComplete();
                      }
                    }}
                  >
                    <action.icon className="size-4 text-muted-foreground" />
                    {action.label}
                    {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

          {currentPage?.render(context, handleComplete)}
        </CommandList>
      </div>
    </CommandDialog>
  );
}

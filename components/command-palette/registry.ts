import type { CommandAction, CommandPage } from "./types";

const actionRegistry = new Map<string, CommandAction>();
const pageRegistry = new Map<string, CommandPage>();
const listeners = new Set<() => void>();

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when nothing has changed, or it re-renders forever. Array.from(...)
// on every call would produce a new array each time, so the snapshot is
// cached and only recomputed when the registry actually mutates.
let actionsSnapshot: CommandAction[] = [];
let actionsSnapshotDirty = true;

function notifyListeners() {
  actionsSnapshotDirty = true;
  for (const listener of listeners) listener();
}

/** Registers a batch of actions. Returns an unregister function — call it
 * from a useEffect cleanup if the actions are scoped to a mounted feature
 * rather than permanent (see registerGlobalActions/issue-actions.ts, which
 * register once at module/effect scope and are never unregistered). */
export function registerActions(actions: CommandAction[]): () => void {
  for (const action of actions) actionRegistry.set(action.id, action);
  notifyListeners();
  return () => {
    for (const action of actions) actionRegistry.delete(action.id);
    notifyListeners();
  };
}

export function registerPage(page: CommandPage): () => void {
  pageRegistry.set(page.id, page);
  notifyListeners();
  return () => {
    pageRegistry.delete(page.id);
    notifyListeners();
  };
}

export function getActions(): CommandAction[] {
  if (actionsSnapshotDirty) {
    actionsSnapshot = Array.from(actionRegistry.values());
    actionsSnapshotDirty = false;
  }
  return actionsSnapshot;
}

export function getPage(id: string): CommandPage | undefined {
  return pageRegistry.get(id);
}

export function subscribeToRegistry(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

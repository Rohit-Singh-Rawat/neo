"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * Registers a single document-level `keydown` listener for the component's
 * lifetime, skipping when focus is in a text input or textarea. `handler` is
 * wrapped in `useEffectEvent` so passing a fresh inline function on every
 * render is correct — the listener is never torn down and re-added just
 * because the handler's closure captured something new.
 */
export function useDocumentKeyDown(handler: (event: KeyboardEvent) => void) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.target instanceof HTMLElement && (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
      return;
    }
    handler(event);
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
}

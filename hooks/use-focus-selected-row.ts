import { useEffect, useRef } from "react";

/**
 * Focuses the row matching `selectedId`, skipping the first run so mounting
 * the tree doesn't steal focus from wherever the page already put it.
 *
 * Keyboard-driven selection moves `selectedId` without touching the DOM
 * directly, so without this the visible focus ring stays on whatever was
 * last clicked/tabbed-to while the "selected" row moves elsewhere.
 */
export function useFocusSelectedRow(selectedId: string, rowRefs: React.RefObject<Map<string, HTMLElement> | null>) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    rowRefs.current?.get(selectedId)?.focus();
  }, [selectedId, rowRefs]);
}

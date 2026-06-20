"use client"

import * as React from "react"

/**
 * Attaches global keyboard shortcuts to the window.
 * Bails out automatically if the user is typing in an input, textarea, or content-editable node
 * to prevent accidental navigation during text entry.
 */
export function useShortcuts(shortcuts: Record<string, () => void>) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      
      // We explicitly check isContentEditable because rich text editors (like TipTap/ProseMirror)
      // often use div or p tags instead of native inputs.
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return
      }

      const key = e.key.toLowerCase()
      const action = shortcuts[key]
      
      if (action) {
        e.preventDefault()
        action()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}

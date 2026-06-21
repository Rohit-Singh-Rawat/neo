"use client"

import { useEffect } from "react"

// Catches errors thrown by the root layout itself (providers, fonts, etc.) —
// app/error.tsx can't catch those since it renders *inside* the root layout.
// Per Next.js's contract, this file must render its own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex h-screen flex-col items-center justify-center gap-3 bg-background text-foreground">
        <h1 className="text-base font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">An unexpected error occurred. Try again, or come back later if it persists.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Try again
        </button>
      </body>
    </html>
  )
}

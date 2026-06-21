"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/design-system/error-state"

export default function IssuesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorState title="Couldn't load issues" onRetry={reset} />
}

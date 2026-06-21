"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/design-system/error-state"

export default function TracesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorState title="Couldn't load traces" onRetry={reset} />
}

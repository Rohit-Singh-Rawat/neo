"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/design-system/error-state"

export default function GlobalRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorState onRetry={reset} />
}

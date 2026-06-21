"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

/** Shared fallback UI for route `error.tsx` boundaries — same shell as the empty/not-found states, with an optional retry action. */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Try again, or come back later if it persists.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={AlertCircleIcon} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </Empty>
  )
}

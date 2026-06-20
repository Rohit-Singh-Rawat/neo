import { Suspense } from "react"
import { IssuesToolbar } from "@/components/issues/issues-toolbar"

export default function IssuesPage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<div className="h-14 border-b border-border/40" />}>
        <IssuesToolbar />
      </Suspense>
      <div className="flex-1 overflow-auto p-6">
        {/* Board will go here */}
      </div>
    </div>
  )
}

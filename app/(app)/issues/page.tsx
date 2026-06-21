import { IssuesToolbar } from "@/components/issues/issues-toolbar"
import { IssuesList } from "@/components/issues/issues-list"

export default function IssuesPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <IssuesToolbar />
      <div className="flex-1 overflow-auto">
        <IssuesList />
      </div>
    </div>
  )
}


"use client"

import { useParams } from "next/navigation"
import { IssueDetail } from "@/components/issues/issue-detail"

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <IssueDetail issueId={id} />
}

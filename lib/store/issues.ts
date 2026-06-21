import { create } from "zustand"

export type IssueStatus = "todo" | "in-progress" | "backlog" | "done" | "canceled" | "duplicate"
export type IssuePriority = "low" | "medium" | "high" | "urgent"

export type LabelColor = "red" | "purple" | "blue" | "gray" | "pink" | "green" | "yellow"

export interface IssueLabel {
  name: string
  color: LabelColor
}

export interface Issue {
  id: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  traceId?: string
  assignee?: string
  labels: IssueLabel[]
  createdAt: string
  dueDate?: string
}

interface IssuesState {
  issues: Issue[]
  createIssue: (issue: Omit<Issue, "id" | "createdAt">) => Issue
  updateIssueStatus: (id: string, status: IssueStatus) => void
  updateIssuePriority: (id: string, priority: IssuePriority) => void
  bulkUpdateStatus: (ids: string[], status: IssueStatus) => void
  bulkUpdatePriority: (ids: string[], priority: IssuePriority) => void
  bulkDelete: (ids: string[]) => void
  restoreIssues: (issues: Issue[]) => void
}

const initialIssues: Issue[] = [
  {
    id: "ISS-001",
    title: "ToolException: connection refused on AgentExecutor",
    status: "todo",
    priority: "high",
    traceId: "trace_g0116",
    assignee: "user-1",
    labels: [{ name: "bug", color: "red" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "ISS-002",
    title: "High latency (> 2s) on gpt-4o generation",
    status: "in-progress",
    priority: "medium",
    traceId: "trace_a992",
    assignee: "user-2",
    labels: [{ name: "performance", color: "yellow" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "ISS-003",
    title: "Parser failed to extract JSON from llm output",
    status: "duplicate",
    priority: "low",
    traceId: "trace_b114",
    assignee: "user-1",
    labels: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "ISS-004",
    title: "User rated response as negative (thumbs down)",
    status: "todo",
    priority: "urgent",
    traceId: "trace_c221",
    assignee: "user-2",
    labels: [{ name: "feedback", color: "purple" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "ISS-005",
    title: "Retrieval returned empty context for exact match query",
    status: "backlog",
    priority: "medium",
    traceId: "trace_d443",
    assignee: "user-1",
    labels: [{ name: "retrieval", color: "blue" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "ISS-006",
    title: "Cost exceeded threshold for simple greeting",
    status: "done",
    priority: "high",
    traceId: "trace_e558",
    assignee: "user-2",
    labels: [{ name: "cost", color: "green" }],
    createdAt: new Date().toISOString(),
  },
]

/** Derives the next sequential `ISS-NNN` id from the highest existing suffix, so concurrent creates never collide. */
function nextIssueId(issues: Issue[]): string {
  const maxSuffix = issues.reduce((max, issue) => {
    const suffix = Number(issue.id.replace("ISS-", ""))
    return Number.isFinite(suffix) && suffix > max ? suffix : max
  }, 0)
  return `ISS-${String(maxSuffix + 1).padStart(3, "0")}`
}

export const useIssuesStore = create<IssuesState>()((set, get) => ({
  issues: initialIssues,
  createIssue: (newIssue) => {
    const created: Issue = {
      ...newIssue,
      id: nextIssueId(get().issues),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ issues: [created, ...state.issues] }))
    return created
  },
  updateIssueStatus: (id, status) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      ),
    })),
  updateIssuePriority: (id, priority) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, priority } : issue
      ),
    })),
  bulkUpdateStatus: (ids, status) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        ids.includes(issue.id) ? { ...issue, status } : issue
      ),
    })),
  bulkUpdatePriority: (ids, priority) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        ids.includes(issue.id) ? { ...issue, priority } : issue
      ),
    })),
  bulkDelete: (ids) =>
    set((state) => ({
      issues: state.issues.filter((issue) => !ids.includes(issue.id)),
    })),
  restoreIssues: (issuesToRestore) =>
    // Used only by the "Undo" toast right after bulkDelete, so issuesToRestore was
    // just removed from state.issues — appending back can't create a duplicate.
    set((state) => ({ issues: [...state.issues, ...issuesToRestore] })),
}))

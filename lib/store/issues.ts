import { create } from "zustand"

export type IssueStatus = "todo" | "in-progress" | "backlog" | "done"
export type IssuePriority = "low" | "medium" | "high" | "urgent"

export interface Issue {
  id: string
  title: string
  status: IssueStatus
  priority: IssuePriority
  traceId?: string
  assignee?: string
  createdAt: string
}

interface IssuesState {
  issues: Issue[]
  createIssue: (issue: Omit<Issue, "id" | "createdAt">) => void
  updateIssueStatus: (id: string, status: IssueStatus) => void
}

// Generate some initial dummy data for the prototype
const initialIssues: Issue[] = [
  {
    id: "WHA-30",
    title: "11 sep work",
    status: "in-progress",
    priority: "urgent",
    assignee: "Sep 2025",
    createdAt: new Date().toISOString(),
  },
  {
    id: "WHA-96",
    title: "redesign landing page and make the ui better and consistent",
    status: "todo",
    priority: "medium",
    assignee: "Jan 7",
    createdAt: new Date().toISOString(),
  },
  {
    id: "WHA-98",
    title: "apple login, check the payment if it's correct",
    status: "backlog",
    priority: "high",
    assignee: "Jan 14",
    createdAt: new Date().toISOString(),
  },
]

export const useIssuesStore = create<IssuesState>()((set) => ({
  issues: initialIssues,
  createIssue: (newIssue) =>
    set((state) => ({
      issues: [
        {
          ...newIssue,
          id: `WHA-${Math.floor(Math.random() * 900) + 100}`,
          createdAt: new Date().toISOString(),
        },
        ...state.issues,
      ],
    })),
  updateIssueStatus: (id, status) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      ),
    })),
}))

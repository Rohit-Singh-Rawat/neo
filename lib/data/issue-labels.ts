import type { IssueLabel } from "@/lib/store/issues"

/** Quick-select labels offered alongside free-text label creation in the create-issue modal. */
export const PREDEFINED_LABELS: IssueLabel[] = [
  { name: "Bug", color: "red" },
  { name: "Feature", color: "purple" },
  { name: "Improvement", color: "blue" },
]

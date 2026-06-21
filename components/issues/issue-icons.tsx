import { cn } from "@/lib/utils"
import type { IssueStatus, IssuePriority, LabelColor, IssueLabel } from "@/lib/store/issues"

type IconProps = React.SVGProps<SVGSVGElement>

function Icon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-3.5", className)}
      {...props}
    >
      {children}
    </svg>
  )
}

export function StatusTodoIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  )
}

export function StatusInProgressIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-warning", className)} {...props}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7v0A5.5 5.5 0 0 1 7 12.5V1.5z" fill="currentColor" />
    </Icon>
  )
}

export function StatusBacklogIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2" />
    </Icon>
  )
}

export function StatusDoneIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-success", className)} {...props}>
      <circle cx="7" cy="7" r="5.5" fill="currentColor" />
      <path d="M4.5 7.5L6 9L9.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function StatusCanceledIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function StatusDuplicateIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  )
}

export function PriorityUrgentIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-destructive", className)} {...props}>
      <rect x="2" y="2" width="10" height="10" rx="3" fill="currentColor" />
      <path d="M7 4.5V7M7 9.5H7.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function PriorityHighIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <path d="M2.5 11V8M6 11V5.5M9.5 11V3M13 11V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function PriorityMediumIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <path d="M2.5 11V8M6 11V5.5M9.5 11V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function PriorityLowIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground", className)} {...props}>
      <path d="M2.5 11V8M6 11V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function PriorityNoneIcon({ className, ...props }: IconProps) {
  return (
    <Icon className={cn("text-muted-foreground/50", className)} {...props}>
      <path d="M2 7H4M6 7H8M10 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

/** Lookup maps from status/priority value → icon component. */
export const statusIconMap: Record<IssueStatus, React.FC<IconProps>> = {
  "todo": StatusTodoIcon,
  "in-progress": StatusInProgressIcon,
  "backlog": StatusBacklogIcon,
  "done": StatusDoneIcon,
  "canceled": StatusCanceledIcon,
  "duplicate": StatusDuplicateIcon,
}

export const priorityIconMap: Record<IssuePriority, React.FC<IconProps>> = {
  urgent: PriorityUrgentIcon,
  high: PriorityHighIcon,
  medium: PriorityMediumIcon,
  low: PriorityLowIcon,
}

export const statusLabels: Record<IssueStatus, string> = {
  "todo": "Todo",
  "in-progress": "In Progress",
  "backlog": "Backlog",
  "done": "Done",
  "canceled": "Canceled",
  "duplicate": "Duplicate",
}

/** Lookup map from label color → solid-fill dot class, shared by the issues list and create-issue modal. */
export const labelDotColor: Record<LabelColor, string> = {
  red: "bg-red-500",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  gray: "bg-gray-500",
  pink: "bg-pink-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
}

/** Default label set offered when creating an issue. */
export const PREDEFINED_LABELS: IssueLabel[] = [
  { name: "Bug", color: "red" },
  { name: "Feature", color: "purple" },
  { name: "Improvement", color: "blue" },
]

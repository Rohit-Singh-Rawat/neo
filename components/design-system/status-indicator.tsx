import { cn } from "@/lib/utils";

type Status = "success" | "error" | "running" | "warning";

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M8 4V9M8 11.5V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RunningIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
      <circle 
        cx="8" cy="8" r="2.5" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="5"
        pathLength="100"
        strokeDasharray="100 100"
        className="animate-pie-step text-running"
        transform="rotate(-90 8 8)"
      />
    </svg>
  );
}

const statusIcon = {
  success: SuccessIcon,
  error: ErrorIcon,
  running: RunningIcon,
  warning: WarningIcon,
} as const;

const statusColorClassName: Record<Status, string> = {
  success: "text-success",
  error: "text-destructive",
  running: "text-running",
  warning: "text-warning",
};

const statusLabels: Record<Status, string> = {
  success: "Success",
  error: "Error",
  running: "Running",
  warning: "Warning",
};

type StatusIndicatorProps = {
  status: Status;
  showLabel?: boolean;
  className?: string;
};

/**
 * Run-status dot for traces/spans (success/error/running/warning) — intentionally
 * distinct from `components/issues/issue-icons.tsx`'s issue *workflow* status
 * vocabulary (todo/in-progress/done/...). The two share the word "status" but
 * are different domain concepts; do not merge them.
 */
export function StatusIndicator({ status, showLabel = false, className }: StatusIndicatorProps) {
  const Icon = statusIcon[status];
  
  return (
    <span className={cn("inline-flex items-center gap-1.5", statusColorClassName[status], className)}>
      <Icon className="shrink-0" />
      <span className={showLabel ? "text-sm" : "sr-only"}>{statusLabels[status]}</span>
    </span>
  );
}

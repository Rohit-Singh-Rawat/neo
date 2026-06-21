/** Formats an ISO timestamp as `"Mar 4, 14:30"` in a fixed locale, so server and client render identical markup. */
export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** Formats a duration in milliseconds, switching to seconds (2 decimals) at the 1000ms boundary. */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Formats USD, showing 4 decimal places below one cent so small per-call costs don't round to "$0.00". */
export function formatCurrency(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

/** Formats a token count with locale-appropriate thousands separators. */
export function formatTokenCount(count: number): string {
  return count.toLocaleString("en-US");
}

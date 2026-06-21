import { Button } from "@/components/ui/button";
import { ColorSwatch, Section } from "./_components/color-swatch";

const statusColors = [
  {
    name: "Success",
    token: "--success",
    className: "bg-success/10 text-success border-success/20",
    usage: "trace/span status: success · issue priority: low",
  },
  {
    name: "Error",
    token: "--destructive",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    usage: "trace/span status: error · Slack severity: high · danger buttons",
  },
  {
    name: "Running",
    token: "--running",
    className: "bg-running/10 text-running border-running/20",
    usage: "trace/span status: running · lifecycle: investigating",
  },
  {
    name: "Warning",
    token: "--warning",
    className: "bg-warning/10 text-warning border-warning/20",
    usage: "Slack severity: medium · lifecycle: triage (awaiting review)",
  },
];

const coreColors = [
  { name: "Background", token: "--background", className: "bg-background text-foreground border-border", usage: "page canvas" },
  { name: "Foreground", token: "--foreground", className: "bg-foreground text-background", usage: "primary text" },
  { name: "Card", token: "--card", className: "bg-card text-card-foreground border-border", usage: "panels, table rows, trace cards" },
  { name: "Popover", token: "--popover", className: "bg-popover text-popover-foreground border-border", usage: "dropdowns, tooltips, dialogs" },
  { name: "Primary", token: "--primary", className: "bg-primary text-primary-foreground", usage: "primary buttons, active nav" },
  { name: "Secondary", token: "--secondary", className: "bg-secondary text-secondary-foreground border-border", usage: "secondary buttons, badges" },
  { name: "Muted", token: "--muted", className: "bg-muted text-muted-foreground border-border", usage: "disabled, subtle panels" },
  { name: "Border", token: "--border", className: "bg-background text-foreground border-2 border-border", usage: "dividers, table rules, card edges" },
];

const chartColors = [
  { name: "chart-1", className: "bg-chart-1" },
  { name: "chart-2", className: "bg-chart-2" },
  { name: "chart-3", className: "bg-chart-3" },
  { name: "chart-4", className: "bg-chart-4" },
  { name: "chart-5", className: "bg-chart-5" },
];

const radii = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "2xl", className: "rounded-2xl" },
];

const spacingSteps = [1, 2, 3, 4, 6, 8, 12];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Design System</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tokens and primitives shared across Traces, Issues, Slack cards, and the Dashboard. One scale, reused — not
        one-off colors per screen.
      </p>

      <Section title="Status colors" description="Reused for trace/span status, Slack severity, lifecycle stage, and issue priority.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {statusColors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Severity/priority reuses this same scale (high → error, medium → warning, low → success) instead of a
          separate priority palette.
        </p>
      </Section>

      <Section title="Core colors">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coreColors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </Section>

      <Section title="Sidebar" description="Sourced from Linear's actual sidebar — three distinct states, all low-contrast on purpose.">
        <div className="overflow-hidden rounded-lg border border-sidebar-border">
          <div className="bg-sidebar p-2">
            <div className="rounded-md px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              Inbox
            </div>
            <div className="rounded-md px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              Projects
            </div>
            <div className="rounded-md bg-sidebar-active px-3 py-1.5 text-sm font-medium text-sidebar-foreground">
              My issues
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Hover the rows above — default (transparent) → hover (<code>--sidebar-accent</code>, #EBEBEC) → active
          (<code>--sidebar-active</code>, #E5E5E6, shown on &quot;My issues&quot;). Sidebar surface itself is
          <code> --sidebar</code> (#F3F3F4).
        </p>
      </Section>

      <Section title="Dropdown / menu" description="Popover surface is pure white; the highlighted row uses the shared accent color.">
        <div className="w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md">
          <div className="rounded-md px-2.5 py-1.5 text-sm text-popover-foreground hover:bg-accent transition-colors">
            Status
          </div>
          <div className="rounded-md bg-accent px-2.5 py-1.5 text-sm text-popover-foreground">Priority</div>
          <div className="rounded-md px-2.5 py-1.5 text-sm text-popover-foreground hover:bg-accent transition-colors">
            Assignee
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          <code>--accent</code> updated to #F1F1F1 (Linear&apos;s dropdown-row highlight) — reused globally for any
          subtle hover/selected surface, not a dropdown-only token.
        </p>
      </Section>

      <Section title="Data viz">
        <div className="flex gap-3">
          {chartColors.map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-1.5">
              <div className={`size-10 rounded-md ${c.className}`} />
              <code className="text-xs text-muted-foreground">{c.name}</code>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Dashboard charts will assign one stable color per model — not by array index.</p>
      </Section>

      <Section title="Typography">
        <div className="space-y-3">
          <p className="font-sans text-base">Inter — UI text (font-sans)</p>
          <p className="font-mono text-base">Geist Mono — IDs, timestamps, code (font-mono)</p>
        </div>
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Weight rule: regular → medium, nothing heavier</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No semibold/bold anywhere in product UI. Hierarchy comes from size, color, and spacing — matching
            Linear&apos;s restraint.
          </p>
          <div className="mt-3 flex items-center gap-4">
            <span className="font-normal">Regular</span>
            <span className="font-medium">Medium (max)</span>
            <span className="font-semibold text-muted-foreground line-through">Semibold — unused</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl font-medium tracking-tight">Display — text-2xl, page titles</p>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Heading — text-sm uppercase, section labels</p>
          <p className="text-sm">Body — text-sm, default UI copy</p>
          <p className="text-xs text-muted-foreground">Caption — text-xs, metadata</p>
          <p className="font-mono text-xs tabular-nums">trace_g0116_s0 · 2,302ms · $0.0080 — mono, tabular-nums</p>
        </div>
      </Section>

      <Section title="Spacing" description="4px base unit (Tailwind default --spacing: 0.25rem).">
        <div className="space-y-1.5">
          {spacingSteps.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <code className="w-10 text-xs text-muted-foreground">{step * 4}px</code>
              <div className="h-3 rounded-sm bg-primary" style={{ width: `${step * 4}px` }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex gap-4">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-1.5">
              <div className={`size-12 border-2 border-primary/30 bg-primary/10 ${r.className}`} />
              <code className="text-xs text-muted-foreground">{r.name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Motion" description="--duration-fast 120ms · --duration-base 180ms · --duration-slow 280ms · --ease-out cubic-bezier(0.16,1,0.3,1)">
        <div className="flex items-center gap-6">
          <div className="size-16 rounded-lg bg-primary/10 border border-primary/20 transition-[transform,background-color] duration-150 ease-(--ease-out) hover:scale-110 hover:bg-primary/20" />
          <p className="text-xs text-muted-foreground">Hover — scale + tint, eased with the same curve used app-wide.</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </Section>

      <Section title="Borderless lists" description="Linear-style dense rows: no cell borders, hover background only, muted small header labels.">
        <div className="rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-accent">
                <td className="px-3 py-1.5">customer_support_agent</td>
                <td className="px-3 py-1.5 text-destructive">Error</td>
              </tr>
              <tr className="hover:bg-accent">
                <td className="px-3 py-1.5">rag_doc_qa</td>
                <td className="px-3 py-1.5 text-success">Success</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Used by the Traces table — separation comes from row height and hover background, never a visible line.
        </p>
      </Section>
    </main>
  );
}

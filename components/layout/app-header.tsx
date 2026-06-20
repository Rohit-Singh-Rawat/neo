"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/traces": "Traces",
  "/issues": "Issues",
  "/dashboard": "Dashboard",
  "/design-system": "Design System",
};

export function AppHeader() {
  const pathname = usePathname();
  
  // Find the matching route name, handling sub-routes
  const title = Object.entries(routeNames).find(([route]) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )?.[1] || "NeoSigma";

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-2">
        <h1 className="text-sm font-medium tracking-tight">{title}</h1>
      </div>
    </header>
  );
}

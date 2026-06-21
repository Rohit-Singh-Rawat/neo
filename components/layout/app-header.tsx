"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeNames: Record<string, string> = {
  "/traces": "Traces",
  "/issues": "Issues",
  "/dashboard": "Dashboard",
  "/alerts": "Alerts",
  "/design-system": "Design System",
};

import { ThemeSwitcher } from "@/components/theme-switcher";

export function AppHeader() {
  const pathname = usePathname();
  
  const basePath = Object.keys(routeNames).find((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const title = basePath ? routeNames[basePath] : "Neo";
  const segments = pathname.split('/').filter(Boolean);
  const isDetailView = basePath && segments.length > 1;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 md:gap-0 border-b border-border/50 dark:border-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger className="-ml-2 bg-transparent hover:bg-transparent" />
      </div>
      <div className="flex items-center gap-2 px-2 md:px-0 flex-1">
        {isDetailView ? (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={basePath} />}>
                  {title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{segments.slice(1).join('/')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <h1 className="text-sm font-medium tracking-tight">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  );
}

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

const routeNames: Record<string, string> = {
  "/traces": "Traces",
  "/issues": "Issues",
  "/dashboard": "Dashboard",
  "/design-system": "Design System",
};

export function AppHeader() {
  const pathname = usePathname();
  
  const basePath = Object.keys(routeNames).find((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const title = basePath ? routeNames[basePath] : "NeoSigma";
  const segments = pathname.split('/').filter(Boolean);
  const isDetailView = basePath && segments.length > 1;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-2">
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
    </header>
  );
}

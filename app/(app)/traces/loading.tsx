import { Skeleton } from "@/components/ui/skeleton";

export default function TracesLoading() {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          {/* Search bar skeleton */}
          <Skeleton className="h-8 w-[240px] rounded-md" />
          {/* Filter dropdowns skeleton */}
          <Skeleton className="h-8 w-[100px] rounded-md" />
          <Skeleton className="h-8 w-[120px] rounded-md" />
          <Skeleton className="h-8 w-[140px] rounded-md" />
          {/* Right side buttons skeleton */}
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-[90px] rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        {/* Table header skeleton */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        {/* Table rows skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-card">
              <div className="flex items-center gap-3 w-1/4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

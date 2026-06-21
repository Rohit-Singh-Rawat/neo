import { Skeleton } from "@/components/ui/skeleton";

export default function IssuesLoading() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-14 border-b border-border/40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[200px] rounded-md" />
          <Skeleton className="h-8 w-[100px] rounded-md" />
        </div>
        <Skeleton className="h-8 w-[120px] rounded-md" />
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 border border-border/40 rounded-xl bg-card">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[300px]" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-[80px] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

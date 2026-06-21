import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="px-6 py-5 pb-2">
        <Skeleton className="h-4 w-[300px] rounded-md" />
      </div>
      <div className="flex-1 space-y-6 px-6 pb-6 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col border border-border/50 rounded-xl p-4 bg-card shadow-sm space-y-4">
            {/* Thread Header */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
            {/* Thread Body */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
            {/* Thread Actions/Attachment */}
            <Skeleton className="h-20 w-full rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

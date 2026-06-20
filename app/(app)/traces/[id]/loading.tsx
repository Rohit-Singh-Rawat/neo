import { Skeleton } from "@/components/ui/skeleton";

export default function TraceDetailLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      <div className="flex flex-1">
        <div className="w-80 shrink-0 space-y-2 border-r border-border p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

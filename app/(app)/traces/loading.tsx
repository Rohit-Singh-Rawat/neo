import { Skeleton } from "@/components/ui/skeleton";

export default function TracesLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="ml-auto h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
      <div className="flex-1 px-2 pt-2">
        <Skeleton className="mb-2 h-10 w-full rounded-md" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="mb-1 h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

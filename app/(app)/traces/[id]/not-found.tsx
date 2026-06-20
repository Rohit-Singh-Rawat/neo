import Link from "next/link";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default function TraceNotFound() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyTitle>Trace not found</EmptyTitle>
        <EmptyDescription>This trace doesn&apos;t exist, or the link is stale.</EmptyDescription>
      </EmptyHeader>
      <Button render={<Link href="/traces" />}>Back to traces</Button>
    </Empty>
  );
}

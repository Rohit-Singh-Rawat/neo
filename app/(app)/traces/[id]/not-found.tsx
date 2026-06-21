import Link from "next/link";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle, EmptyMedia } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function TraceNotFound() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon"><HugeiconsIcon icon={Search01Icon} /></EmptyMedia>
        <EmptyTitle>Trace not found</EmptyTitle>
        <EmptyDescription>This trace doesn&apos;t exist, or the link is stale.</EmptyDescription>
      </EmptyHeader>
      <Button render={<Link href="/traces" />}>Back to traces</Button>
    </Empty>
  );
}

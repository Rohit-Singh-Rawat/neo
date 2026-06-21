import { getAllThreads } from "@/lib/data/slack-cards";
import { CardThread } from "@/components/slack/card-thread";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function AlertsPage() {
  const threads = getAllThreads();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-6 py-5 pb-2">
        <p className="text-sm text-muted-foreground">Cards the monitor bot has posted to Slack.</p>
      </div>
      {threads.length === 0 ? (
        <Empty className="flex-1">
          <EmptyHeader>
            <EmptyTitle>No alerts yet</EmptyTitle>
            <EmptyDescription>The monitor bot hasn&apos;t posted anything to Slack yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex-1 space-y-6 px-6 pb-6">
          {threads.map((thread) => (
            <CardThread key={thread[0].id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
}

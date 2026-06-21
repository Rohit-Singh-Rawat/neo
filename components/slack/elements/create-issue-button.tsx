"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useIssuesStore } from "@/lib/store/issues";

export function CreateIssueButton({
  traceId,
  title,
  disabled,
  onCreated,
}: {
  traceId: string;
  title: string;
  disabled: boolean;
  onCreated: () => void;
}) {
  const router = useRouter();
  const createIssue = useIssuesStore((state) => state.createIssue);

  function handleClick() {
    const created = createIssue({ title, status: "todo", priority: "high", traceId, labels: [] });
    onCreated();
    toast.success(`Issue ${created.id} created`, {
      action: { label: "View", onClick: () => router.push("/issues") },
    });
  }

  return (
    <button type="button" disabled={disabled} onClick={handleClick} className="slack-button">
      {disabled ? "Issue created" : "Create issue"}
    </button>
  );
}

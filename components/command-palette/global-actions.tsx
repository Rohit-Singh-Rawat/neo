import type { useRouter } from "next/navigation"
import {
  Activity01Icon,
  AlertCircleIcon,
  DashboardCircleIcon,
  ExclamationMarkBigIcon,
  Loading03Icon,
  Megaphone01Icon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { registerActions } from "./registry"

/** Registers global navigation actions scoped to the router instance that invoked it. */
export function registerGlobalActions(router: ReturnType<typeof useRouter>): () => void {
  return registerActions([
    {
      id: "go-to-issues",
      label: "Go to issues",
      icon: (props) => <HugeiconsIcon icon={ExclamationMarkBigIcon} {...props} />,
      shortcut: "I",
      group: "Navigation",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/issues"),
    },
    {
      id: "go-to-traces",
      label: "View active traces",
      icon: (props) => <HugeiconsIcon icon={Activity01Icon} {...props} />,
      shortcut: "T",
      group: "Navigation",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/traces"),
    },
    {
      id: "go-to-dashboard",
      label: "Open dashboard",
      icon: (props) => <HugeiconsIcon icon={DashboardCircleIcon} {...props} />,
      shortcut: "D",
      group: "Navigation",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/dashboard"),
    },
    {
      id: "go-to-alerts",
      label: "Go to alerts",
      icon: (props) => <HugeiconsIcon icon={Megaphone01Icon} {...props} />,
      shortcut: "A",
      group: "Navigation",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/alerts"),
    },
    {
      id: "go-to-design-system",
      label: "Go to design system",
      icon: (props) => <HugeiconsIcon icon={PaintBoardIcon} {...props} />,
      group: "Navigation",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/design-system"),
    },
    {
      id: "show-error-traces",
      label: "Show error traces",
      icon: (props) => <HugeiconsIcon icon={AlertCircleIcon} {...props} />,
      group: "Observability",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/traces?status=error"),
    },
    {
      id: "show-running-traces",
      label: "Show running traces",
      icon: (props) => <HugeiconsIcon icon={Loading03Icon} {...props} />,
      group: "Observability",
      contextTypes: ["global"],
      type: "action",
      perform: () => router.push("/traces?status=running"),
    },
  ])
}

"use client"

import { useRouter } from "next/navigation"
import { useShortcuts } from "@/lib/hooks/use-shortcuts"

export function GlobalShortcuts() {
  const router = useRouter()

  useShortcuts({
    i: () => router.push("/issues"),
    t: () => router.push("/traces"),
    d: () => router.push("/dashboard"),
  })

  return null
}

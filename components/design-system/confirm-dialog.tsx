"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ConfirmOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type ConfirmState = ConfirmOptions & {
  resolve: (confirmed: boolean) => void
}

const ConfirmContext = React.createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null)

/** Mounts the app's single confirm-dialog instance and exposes `useConfirm()` to all descendants. */
function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ConfirmState | null>(null)

  const confirm = React.useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve })
    })
  }, [])

  const settle = (confirmed: boolean) => {
    state?.resolve(confirmed)
    setState(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={state !== null} onOpenChange={(open) => !open && settle(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state?.title}</DialogTitle>
            {state?.description ? <DialogDescription>{state.description}</DialogDescription> : null}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => settle(false)}>
              {state?.cancelLabel ?? "Cancel"}
            </Button>
            <Button variant={state?.destructive ? "destructive" : "default"} onClick={() => settle(true)}>
              {state?.confirmLabel ?? "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

/** Imperative confirm prompt for destructive/irreversible actions; resolves `true` on confirm, `false` on cancel or dismiss. */
function useConfirm() {
  const confirm = React.useContext(ConfirmContext)
  if (!confirm) {
    throw new Error("useConfirm must be used within a ConfirmProvider")
  }
  return confirm
}

export { ConfirmProvider, useConfirm }

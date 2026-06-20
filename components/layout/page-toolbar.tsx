import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageToolbar({ className, children, ...props }: PageToolbarProps) {
  return (
    <div 
      className={cn("flex h-14 w-full shrink-0 items-center justify-between border-b border-border/40 bg-background px-6", className)} 
      {...props}
    >
      {children}
    </div>
  )
}

export function PageToolbarLeft({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export function PageToolbarRight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props}>
      {children}
    </div>
  )
}

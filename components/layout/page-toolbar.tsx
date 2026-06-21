import * as React from "react"
import { cn } from "@/lib/utils"

export type PageToolbarProps = React.HTMLAttributes<HTMLDivElement>

export function PageToolbar({ className, children, ...props }: PageToolbarProps) {
  return (
    <div 
      className={cn("flex flex-row h-14 w-full shrink-0 items-center justify-between bg-background px-4 sm:px-6 py-0 gap-2 sm:gap-0", className)} 
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
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)} {...props}>
      {children}
    </div>
  )
}

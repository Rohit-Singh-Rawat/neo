"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

export interface ViewOptionConfig {
  id: string
  label: string
  defaultChecked?: boolean
}

export interface ViewRadioGroup {
  id: string
  label: string
  options: { value: string; label: string }[]
  defaultValue: string
}

interface ViewOptionsMenuProps {
  radioGroups?: ViewRadioGroup[]
  toggles?: ViewOptionConfig[]
}

export function ViewOptionsMenu({ radioGroups, toggles }: ViewOptionsMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    // For toggles, we'll store them as truthy values in the URL or omit them
    // If it exists, remove it (toggle off). If not, add it (toggle on).
    // Note: In a robust app, we'd compare against defaultValue to avoid cluttering URL.
    if (params.has(id)) {
      params.delete(id)
    } else {
      params.set(id, "true")
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleRadioChange = (groupId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(groupId, value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="icon" className="size-7 rounded-full text-muted-foreground border-border/40 hover:bg-muted/50 data-[state=open]:bg-muted/50 data-[state=open]:text-foreground">
          <HugeiconsIcon icon={Settings01Icon} className="size-3.5" strokeWidth={1.5} />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {radioGroups?.map((group) => {
          const currentValue = searchParams.get(group.id) || group.defaultValue
          return (
            <React.Fragment key={group.id}>
              <DropdownMenuGroup>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {group.label}
                </div>
                <DropdownMenuRadioGroup value={currentValue} onValueChange={(val) => handleRadioChange(group.id, val)}>
                  {group.options.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </React.Fragment>
          )
        })}

        {toggles && toggles.length > 0 && (
          <DropdownMenuGroup>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Properties
            </div>
            {toggles.map((toggle) => {
              // If default is true, it's ON when param isn't 'false'. If default is false, it's ON when param is 'true'.
              const paramValue = searchParams.get(toggle.id)
              const isChecked = toggle.defaultChecked 
                ? paramValue !== "false" 
                : paramValue === "true"

              return (
                <DropdownMenuCheckboxItem
                  key={toggle.id}
                  checked={isChecked}
                  onCheckedChange={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    // Toggle logic based on default
                    if (toggle.defaultChecked) {
                      if (isChecked) params.set(toggle.id, "false")
                      else params.delete(toggle.id)
                    } else {
                      if (isChecked) params.delete(toggle.id)
                      else params.set(toggle.id, "true")
                    }
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                  }}
                >
                  {toggle.label}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDefinition {
  id: string
  label: string
  options: FilterOption[]
}

interface FilterMenuProps {
  filters: FilterDefinition[]
}

export function FilterMenu({ filters }: FilterMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggle = (filterId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(filterId)

    if (currentValues.includes(value)) {
      // Remove value
      params.delete(filterId)
      currentValues.filter((v) => v !== value).forEach((v) => params.append(filterId, v))
    } else {
      // Add value
      params.append(filterId, value)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="icon" className="size-7 rounded-full text-muted-foreground border-border/40 hover:bg-muted/50 data-[state=open]:bg-muted/50 data-[state=open]:text-foreground">
          <HugeiconsIcon icon={FilterIcon} className="size-3.5" strokeWidth={1.5} />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters.map((filter) => (
          <DropdownMenuGroup key={filter.id}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {filter.label}
            </div>
            {filter.options.map((option) => {
              const isChecked = searchParams.getAll(filter.id).includes(option.value)
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(filter.id, option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              )
            })}
            <DropdownMenuSeparator className="last:hidden" />
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

// types
import type { z } from "zod"
import type { SortPattern } from "@/lib/types/search"

// utils
import { cn } from "@/lib/util"

// icons
import { ArrowDownUp, LucideProps, SortAsc, SortDesc } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useSearch } from "@/hooks/use-search"

type SortButtonProps<S extends SortPattern> = {
  sortSchema: z.ZodSchema<S>
  sortValueKey: keyof S
  iconProps?: LucideProps
} & Omit<React.ComponentProps<typeof Button>, "onClick">

function SortButton<S extends SortPattern>({
  sortSchema,
  sortValueKey,
  iconProps,
  variant = "ghost",
  size= "icon",
  className,
  children,
  ...props
}: SortButtonProps<S>) {
  const { sort, toggleSortParam } = useSearch({ sortSchema })

  return (
    <Button className={cn("p-1.5 gap-x-2", className)}
      variant={variant}
      size={size}
      onClick={() => toggleSortParam(sortValueKey)}
      {...props}
    >
      <ArrowDownUp {...iconProps}
        className={cn("size-4 sm:size-5 flex-none transition-all", {
          "rotate-0 scale-100": !sort[sortValueKey],
          "-rotate-90 scale-0": !!sort[sortValueKey]
        }, iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.5}
      />

      <SortAsc {...iconProps}
        className={cn("absolute size-4 sm:size-5 flex-none transition-all", {
          "rotate-0 scale-100": sort[sortValueKey] === 'asc',
          "-rotate-90 scale-0": sort[sortValueKey] !== 'asc'
        }, iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.5}
      />

      <SortDesc {...iconProps}
        className={cn("absolute size-4 sm:size-5 flex-none transition-all", {
          "rotate-0 scale-100": sort[sortValueKey] === 'desc',
          "-rotate-90 scale-0": sort[sortValueKey] !== 'desc'
        }, iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.5}
      />

      {children}
    </Button>
  )
}

export default SortButton

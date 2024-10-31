"use client"

// utils
import { cn } from "@/lib/utils"

// icons
import { ArrowDownUp, LucideProps, SortAsc, SortDesc } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

type SortButtonProps<T extends { [key in keyof T]: string | number | boolean }> = {
  sortValueKey: keyof T
  iconProps?: LucideProps
} & Omit<React.ComponentProps<typeof Button>, 'onClick'>

function SortButton<T extends { [key in keyof T]: string | number | boolean }>({
  sortValueKey,
  iconProps,
  variant = "ghost",
  size= "icon",
  className,
  children,
  ...props
}: SortButtonProps<T>) {
  const { sort, toggleSortParam } = useFilterParams<T>()

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

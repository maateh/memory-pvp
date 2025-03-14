"use client"

import { useMemo } from "react"

// types
import type { LucideProps } from "lucide-react"
import type { SortKey } from "@repo/schema/search"
import type { SortOption, SortPattern, SortSchemaKey } from "@/lib/types/search"

// config
import { sortSettings } from "@/config/sort-settings"

// utils
import { cn } from "@/lib/util"

// icons
import { ArrowDownUp, SortAsc, SortDesc } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// hooks
import { useSearch } from "@/hooks/use-search"

type SortDropdownButtonProps = {
  schemaKey: SortSchemaKey
  iconProps?: LucideProps
} & React.ComponentProps<typeof Button>

function SortDropdownButton<S extends SortPattern>({
  schemaKey,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: SortDropdownButtonProps) {
  const { options, sortSchema } = useMemo(() => sortSettings<S>(schemaKey), [schemaKey])
  const { sort, toggleSortParam } = useSearch({ sortSchema })

  /* Gets only the first sort entry even if there are multiple specified. */
  const { sortValueKey, sortKey } = useMemo(() => {
    const firstEntry = Object.entries(sort)[0]
    return (firstEntry || {}) as Partial<{
      sortValueKey: keyof S
      sortKey: SortKey
    }>
  }, [sort])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("p-1.5 gap-x-2 border border-border/20", className)}
          tooltip={{
            children: (
              <div className="flex items-center gap-x-1.5">
                <ArrowDownUp className={cn("size-3.5 flex-none", { "hidden": !!sortKey })} />
                <SortAsc className={cn("size-4 flex-none", { "hidden": sortKey !== "asc" })} />
                <SortDesc className={cn("size-4 flex-none", { "hidden": sortKey !== "desc" })} />
  
                <p className="font-light dark:font-extralight">
                  Sort by <span className={cn("lowercase text-accent font-medium", { "text-destructive": sortKey === "desc" })}>
                    {sortValueKey ? options[sortValueKey]?.label : 'default'}
                  </span>
                </p>
              </div>
            )
          }}
          variant={variant}
          size={size}
          {...props}
        >
          <ArrowDownUp {...iconProps}
            className={cn("size-4 sm:size-5 flex-none transition-all", {
              "rotate-0 scale-100": !sortKey,
              "-rotate-90 scale-0": !!sortKey
            }, iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 2.5}
          />

          <SortAsc {...iconProps}
            className={cn("absolute size-4 sm:size-5 flex-none transition-all", {
              "rotate-0 scale-100": sortKey === "asc",
              "-rotate-90 scale-0": sortKey !== "asc"
            }, iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 2.5}
          />

          <SortDesc {...iconProps}
            className={cn("absolute size-4 sm:size-5 flex-none transition-all", {
              "rotate-0 scale-100": sortKey === "desc",
              "-rotate-90 scale-0": sortKey !== "desc"
            }, iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 2.5}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.values<SortOption<S>>(options).map(({ label, sortValueKey }) => (
          <DropdownMenuItem className={cn("justify-between", {
            "text-accent bg-accent/10": sort[sortValueKey] === "asc",
            "text-destructive bg-destructive/10": sort[sortValueKey] === "desc"
          })}
            variant="muted"
            onClick={() => toggleSortParam(sortValueKey)}
            key={label}
          >
            <span>{label}</span>

            <ArrowDownUp className={cn("size-3 flex-none text-muted-foreground/70", { "hidden": !!sort[sortValueKey] })}
              strokeWidth={2.5}
            />

            <SortAsc className={cn("size-3.5 flex-none", { "hidden": sort[sortValueKey] !== "asc" })}
              strokeWidth={2.5}
            />

            <SortDesc className={cn("size-3.5 flex-none", { "hidden": sort[sortValueKey] !== "desc" })}
              strokeWidth={2.5}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortDropdownButton

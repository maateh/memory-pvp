"use client"

import { useEffect, useMemo } from "react"

// types
import type { CollectionFilter } from "./types"

// utils
import { cn } from "@/lib/utils"

// icons
import { UserRoundCheck, UserRoundMinus } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

type CollectionUserToggleFilterProps = {
  includeByDefault?: boolean
} & Omit<React.ComponentProps<typeof ButtonTooltip>, 'tooltip' | 'onClick'>

const CollectionUserToggleFilter = ({
  includeByDefault = false,
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: CollectionUserToggleFilterProps) => {
  const { filter, toggleFilterParam } = useFilterParams<CollectionFilter>()

  const includeUser = useMemo(() => {
    if (filter.includeUser === undefined) {
      return includeByDefault
    }

    return filter.includeUser.toString() === 'true'
  }, [filter.includeUser, includeByDefault])

  return (
    <ButtonTooltip className={cn("p-1.5 border border-border/20", className)}
      variant={variant}
      size={size}
      tooltip={(
        <div className="flex items-center gap-x-2">
          <UserRoundCheck className={cn("size-4 text-accent", { "hidden": !includeUser })} />
          <UserRoundMinus className={cn("size-4 text-destructive", { "hidden": includeUser })} />

          <p className="font-light dark:font-extralight">
            {filter.includeUser ? 'Include' : 'Exclude'} collections created by you
          </p>
        </div>
      )}
      onClick={() => toggleFilterParam('includeUser', includeUser ? 'false' : 'true')}
      {...props}
    >
      <UserRoundCheck className={cn("size-3.5 sm:size-4 text-accent transition-all", {
        "rotate-0 scale-100": includeUser,
        "-rotate-90 scale-0": !includeUser
      })} />

      <UserRoundMinus className={cn("absolute size-3.5 sm:size-4 text-destructive transition-all", {
        "rotate-0 scale-100": !includeUser,
        "-rotate-90 scale-0": includeUser
      })} />
    </ButtonTooltip>
  )
}

export default CollectionUserToggleFilter

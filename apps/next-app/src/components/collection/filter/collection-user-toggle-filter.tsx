"use client"

// schemas
import { collectionFilter } from "@repo/schema/collection"

// utils
import { cn } from "@/lib/util"

// icons
import { UserRoundCheck, UserRoundMinus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

const CollectionUserToggleFilter = ({
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) => {
  const { filter, toggleFilterParam } = useFilterParams({
    filterSchema: collectionFilter
  })

  return (
    <Button className={cn("p-1.5 border border-border/20", className)}
      variant={variant}
      size={size}
      tooltip={`${filter.excludeUser ? 'Hide' : 'Show'} collections created by you`}
      onClick={() => toggleFilterParam('excludeUser', filter.excludeUser ? 'false' : 'true')}
      {...props}
    >
      <UserRoundCheck className={cn("size-3.5 sm:size-4 text-accent transition-all", {
        "rotate-0 scale-100": !filter.excludeUser,
        "-rotate-90 scale-0": filter.excludeUser
      })} />

      <UserRoundMinus className={cn("absolute size-3.5 sm:size-4 text-destructive transition-all", {
        "rotate-0 scale-100": filter.excludeUser,
        "-rotate-90 scale-0": !filter.excludeUser
      })} />
    </Button>
  )
}

export default CollectionUserToggleFilter

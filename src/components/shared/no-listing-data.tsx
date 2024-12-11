"use client"

// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { FilterX, OctagonX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

type NoListingDataProps = {
  Icon?: LucideIcon
  iconProps?: LucideProps
  message?: string
  messageProps?: React.ComponentProps<"p">
  clearFilterMessage?: string
  hideClearFilter?: boolean
} & React.ComponentProps<"div">

const NoListingData = ({
  Icon = OctagonX,
  iconProps,
  message = "No data found.",
  messageProps,
  clearFilterMessage = "If you have specified any filter, try clearing it.",
  hideClearFilter = false,
  className,
  ...props
}: NoListingDataProps) => {
  const { clearFilterParams } = useFilterParams()

  return (
    <div className={cn("px-4 space-y-5 flex flex-col items-center justify-center text-center", className)} {...props}>
      <div className="space-y-2.5 flex flex-col items-center justify-center">
        <Icon {...iconProps}
          className={cn("size-10 sm:size-12 md:size-14 shrink-0 text-muted-foreground", iconProps?.className)}
          strokeWidth={iconProps?.strokeWidth || 1.5}
        />

        <p {...messageProps}
          className={cn("text-lg sm:text-xl md:text-2xl text-muted-foreground/80 font-normal", messageProps?.className)}
        >
          {message}
        </p>
      </div>

      {!hideClearFilter && (
        <div className="space-y-2 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground/80 font-light">
            If you have specified any filter, try clearing it.
          </p>
  
          <Button className="gap-x-2 text-primary-foreground/65 font-light"
            size="sm"
            onClick={() => clearFilterParams("reset")}
          >
            <FilterX className="size-4" />
            <span>Clear filter</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default NoListingData

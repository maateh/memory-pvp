// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Info, RefreshCcwDot, RefreshCw, RefreshCwOff } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

type SyncStatus = "synchronized" | "synchronizing" | "out_of_sync"

const syncIconMap: Record<SyncStatus, LucideIcon> = {
  synchronized: RefreshCw,
  synchronizing: RefreshCcwDot,
  out_of_sync: RefreshCwOff
}

const syncTooltipMap: Record<SyncStatus, string> = {
  synchronized: "Synchronized",
  synchronizing: "Synchronizing...",
  out_of_sync: "Not synchronized"
}

type SyncIndicatorProps = {
  status: SyncStatus
  iconProps?: LucideProps
  tooltipProps?: React.ComponentProps<typeof TooltipContent>
} & React.ComponentProps<typeof TooltipTrigger>

const SyncIndicator = ({
  status,
  iconProps,
  tooltipProps,
  className,
  ...props
}: SyncIndicatorProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={cn("cursor-help", className)} {...props}>
          <SyncIcon status={status} {...iconProps} />
        </TooltipTrigger>

        <TooltipContent {...tooltipProps}>
          <div className="flex items-center gap-x-2">
            <Info className="size-4 shrink-0 text-muted-foreground" />
            <p className="mt-1 text-foreground/85 text-sm font-heading">
              Status info
            </p>
          </div>

          <Separator className="my-1 bg-border/25" />

          <ul className="space-y-1">
            {Object.keys(syncIconMap).map((key) => {
              const status = key as SyncStatus

              return (
                <li className="flex items-center gap-x-2" key={status}>
                  <SyncIcon {...iconProps}
                    className="size-4"
                    status={status}
                    strokeWidth={2.75}
                  />
                  
                  <p className={cn("text-sm font-light", {
                    "text-accent": status === "synchronized",
                    "text-muted-foreground": status === "synchronizing",
                    "text-destructive": status === "out_of_sync"
                  })}>
                    {syncTooltipMap[status]}
                  </p>
                </li>
              )
            })}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type SyncIconProps = {
  status: SyncStatus
} & LucideProps

const SyncIcon = ({ status, strokeWidth = 2.5, className, ...props }: SyncIconProps) => {
  const Icon = syncIconMap[status]

  return (
    <Icon className={cn("size-3.5 shrink-0", {
      "text-accent animate-spin-slow": status === "synchronized",
      "text-muted-foreground animate-spin": status === "synchronizing",
      "text-destructive animate-pulse": status === "out_of_sync"
    }, className)} strokeWidth={strokeWidth} {...props} />
  )
}

export default SyncIndicator
export { SyncIcon }
export type { SyncStatus }

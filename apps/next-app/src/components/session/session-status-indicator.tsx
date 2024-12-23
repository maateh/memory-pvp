// types
import type { GameStatus } from "@prisma/client"
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Hash } from "lucide-react"

type SessionStatusIndicatorProps = {
  status: GameStatus
  withIcon?: boolean
  iconProps?: LucideProps
} & React.ComponentProps<"div">

const SessionStatusIndicator = ({ status, withIcon, iconProps, className, ...props }: SessionStatusIndicatorProps) => {
  return (
    <div className={cn("size-3.5 rounded-xl border border-border/50 shrink-0", {
      "size-fit border-none": withIcon,
      "bg-yellow-500 dark:bg-yellow-200": !withIcon && status === 'RUNNING',
      "bg-secondary": !withIcon && status === 'FINISHED',
      "bg-destructive": !withIcon && status === 'ABANDONED',
      "bg-muted-foreground/80": !withIcon && status === 'OFFLINE'
    }, className)} {...props}>
      {withIcon && (
        <Hash {...iconProps}
          className={cn("size-3.5 shrink-0", {
            "text-yellow-500 dark:text-yellow-200": status === 'RUNNING',
            "text-secondary": status === 'FINISHED',
            "text-destructive": status === 'ABANDONED',
            "text-muted-foreground/80": status === 'OFFLINE'
          }, iconProps?.className)}
          strokeWidth={iconProps?.strokeWidth || 4}
        />
      )}
    </div>
  )
}

export default SessionStatusIndicator

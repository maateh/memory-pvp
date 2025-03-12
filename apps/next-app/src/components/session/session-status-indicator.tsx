// types
import type { SessionStatus } from "@repo/db"
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Hash } from "lucide-react"

type SessionStatusIndicatorProps = {
  status: SessionStatus
  withIcon?: boolean
  iconProps?: LucideProps
} & React.ComponentProps<"div">

const SessionStatusIndicator = ({ status, withIcon, iconProps, className, ...props }: SessionStatusIndicatorProps) => {
  return (
    <div className={cn("size-3.5 rounded-xl border border-border/50 shrink-0", {
      "size-fit border-none": withIcon,
      "bg-yellow-500 dark:bg-yellow-200": !withIcon && status === "RUNNING",
      "bg-secondary": !withIcon && status === "FINISHED",
      "bg-destructive": !withIcon && status === "CLOSED",
      "bg-muted-foreground/80": !withIcon && status === "FORCE_CLOSED"
    }, className)} {...props}>
      {withIcon && (
        <Hash {...iconProps}
          className={cn("size-3.5 shrink-0", {
            "text-yellow-500 dark:text-yellow-200": status === "RUNNING",
            "text-secondary": status === "FINISHED",
            "text-destructive": status === "CLOSED",
            "text-muted-foreground/80": status === "FORCE_CLOSED"
          }, iconProps?.className)}
          strokeWidth={iconProps?.strokeWidth || 4}
        />
      )}
    </div>
  )
}

export default SessionStatusIndicator

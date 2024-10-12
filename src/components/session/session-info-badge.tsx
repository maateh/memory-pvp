// types
import type { LucideIcon } from "lucide-react"
import type { BadgeProps } from "@/components/ui/badge"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { BadgeWithIcon } from "@/components/ui/badge"

type SessionInfoBadgeProps = {
  Icon: LucideIcon
  label: string
  subLabel: string
} & BadgeProps

const SessionInfoBadge = ({
  Icon, label, subLabel,
  className, variant = "accent", ...props
}: SessionInfoBadgeProps) => {
  return (
    <BadgeWithIcon className={cn("bg-secondary/20 hover:bg-secondary/30 text-foreground", className)}
      Icon={Icon}
      {...props}
    >
      <p className="space-x-1 pt-0.5 text-sm font-heading">
        <span className="font-medium small-caps">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          / {subLabel}
        </span>
      </p>
    </BadgeWithIcon>
  )
}

export default SessionInfoBadge

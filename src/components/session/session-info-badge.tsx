// utils
import { cn } from "@/lib/utils"

// shadcn
import { BadgeWithIcon } from "@/components/ui/badge"

type SessionInfoBadgeProps = {
  label: string
  subLabel: string
} & React.ComponentProps<typeof BadgeWithIcon>

const SessionInfoBadge = ({
  label,
  subLabel,
  className,
  variant = "accent",
  ...props
}: SessionInfoBadgeProps) => {
  return (
    <BadgeWithIcon className={cn("bg-secondary/20 hover:bg-secondary/30 text-sm font-heading font-medium text-foreground", className)}
      variant={variant}
      {...props}
    >
      <p className="space-x-1 mt-1">
        <span className="small-caps">
          {label}
        </span>
        <span className="text-muted-foreground text-[90%]">
          / {subLabel}
        </span>
      </p>
    </BadgeWithIcon>
  )
}

export default SessionInfoBadge

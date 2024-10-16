// types
import type { LucideIcon, LucideProps } from "lucide-react"
import type { BadgeProps } from "@/components/ui/badge"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Badge } from "@/components/ui/badge"

type PlayerStatBadgeProps = {
  Icon: LucideIcon
  iconProps?: LucideProps
} & Omit<BadgeProps, 'children'>
  & ({
    stat: string
    children?: never
  } | {
    stat?: never
    children: React.ReactNode
  })

const PlayerStatBadge = ({ Icon, iconProps, className, stat, children, ...props }: PlayerStatBadgeProps) => {
  return (
    <Badge className={cn("py-1 gap-x-1.5 font-normal tracking-wide", className)}
      {...props}
    >
      <Icon {...iconProps}
        className={cn("size-4 flex-none", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 1.75}
      />

      <span>
        {children || stat}
      </span>
    </Badge>
  )
}

export default PlayerStatBadge

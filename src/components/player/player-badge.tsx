// utils
import { cn } from "@/lib/utils"

// prisma
import { PlayerProfile } from "@prisma/client"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// components
import { PlayerVerifiedBadge } from "@/components/player"

type PlayerBadgeProps = {
  player: Pick<PlayerProfile, 'tag' | 'color' | 'isActive'>
  hideVerified?: boolean
  flagProps?: React.HTMLAttributes<HTMLDivElement>
} & BadgeProps

const PlayerBadge = ({
  player,
  hideVerified = false,
  flagProps,
  className,
  ...props
}: PlayerBadgeProps) => {
  return (
    <Badge className={cn("group py-1 text-sm flex items-center gap-x-1.5 border-secondary/50 dark:border-secondary/20", className)}
      {...props}
    >
      <div {...flagProps}
        className={cn("size-2.5 rounded-md transition border border-foreground/25 group-hover:opacity-85", flagProps?.className)}
        style={{
          ...flagProps?.style,
          backgroundColor: player.color
        }}
      />

      <span className="font-medium">
        #{player.tag}
      </span>

      {!hideVerified && player.isActive && (
        <div className="flex-1 flex justify-end">
          <PlayerVerifiedBadge className="mx-auto" />
        </div>
      )}
    </Badge>
  )
}

export default PlayerBadge

// prisma
import { PlayerProfile } from "@prisma/client"

// shadcn
import { Badge } from "@/components/ui/badge"

// components
import { PlayerVerifiedBadge } from "@/components/player"

type PlayerBadgeProps = {
  player: Pick<PlayerProfile, 'tag' | 'color'>
}

const PlayerBadge = ({ player }: PlayerBadgeProps) => {
  return (
    <Badge className="py-1 flex items-center gap-x-1.5">
      <div className="size-3 rounded-sm transition hover:opacity-90"
        style={{ backgroundColor: player.color }}
      />

      <span className="font-light">
        #{player.tag}
      </span>

      <PlayerVerifiedBadge />
    </Badge>
  )
}

export default PlayerBadge

// types
import type { RoomPlayer } from "@repo/schema/room-player"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// icons
import { Check, X } from "lucide-react"

// shadcn
import { BadgeWithIcon } from "@/components/ui/badge"

// components
import { PlayerBadge } from "@/components/player"
import { UserAvatar } from "@/components/user"
import { StatisticBadge } from "@/components/shared"

type JoinedPlayerProps = {
  player: RoomPlayer
}

const JoinedPlayer = ({ player }: JoinedPlayerProps) => {
  const { score } = getRendererPlayerStats(player, ['score'])

  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <UserAvatar className="size-12"
        imageSize={256}
        user={{
          username: player.tag,
          imageUrl: player.imageUrl
        }}
      />
      
      <PlayerBadge size="lg" player={player} />
      
      <StatisticBadge statistic={score} />

      <BadgeWithIcon className={cn("gap-x-1 opacity-90", { "opacity-40": !player.ready })}
        variant={player.ready ? "secondary" : "destructive"}
        Icon={player.ready ? Check : X}
      >
        {player.ready ? "Ready": "Unready"}
      </BadgeWithIcon>
    </div>
  )
}

export default JoinedPlayer

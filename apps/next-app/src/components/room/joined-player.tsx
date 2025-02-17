"use client"

// types
import type { RoomStatus } from "@repo/schema/room"
import type { RoomPlayer } from "@repo/schema/room-player"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// icons
import { Check, WifiOff, X } from "lucide-react"

// shadcn
import { BadgeWithIcon } from "@/components/ui/badge"

// components
import { PlayerBadge } from "@/components/player"
import { UserAvatar } from "@/components/user"
import { HoverActionOverlay, StatisticBadge } from "@/components/shared"

type JoinedPlayerProps = {
  player: RoomPlayer
  disableKick?: boolean
  handleKick?: () => void
}

const JoinedPlayer = ({ player, disableKick = false, handleKick }: JoinedPlayerProps) => {
  const { score } = getRendererPlayerStats(player, ["score"])
  const isOffline = player.connection.status === "offline"

  return (
    <HoverActionOverlay className={cn("pt-4 pb-8 flex flex-col items-center justify-center gap-y-2 relative", {
      "opacity-40": isOffline
    })}
      hoverAction={handleKick}
      disableOverlay={disableKick || !handleKick}
      overlayProps={{
        className: "bg-destructive/40",
        children: (
          <div className="flex flex-col items-center justify-center gap-y-2">
            <X className="size-6 sm:size-7 shrink-0" strokeWidth={5} />
            <p className="text-base sm:text-lg font-heading font-semibold">
              Kick player
            </p>
          </div>
        )
      }}
    >
      <UserAvatar className="size-12"
        imageSize={256}
        user={{
          username: player.tag,
          imageUrl: player.imageUrl
        }}
      />
      
      <PlayerBadge size="lg" player={player} />
      
      <StatisticBadge className={cn({ "opacity-80": player.stats.score < 0 })}
        variant={player.stats.score < 0 ? "destructive" : "accent"}
        statistic={score}
      />

      <BadgeWithIcon className={cn("gap-x-1 opacity-90", {
        "opacity-45": !player.ready && !isOffline
      })}
        variant={isOffline ? "muted" : player.ready ? "secondary" : "destructive"}
        Icon={isOffline ? WifiOff : player.ready ? Check : X}
      >
        {isOffline ? "Offline" : player.ready ? "Ready": "Unready"}
      </BadgeWithIcon>
    </HoverActionOverlay>
  )
}

export default JoinedPlayer

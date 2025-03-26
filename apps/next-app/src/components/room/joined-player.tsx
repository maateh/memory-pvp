"use client"

// types
import type { RoomPlayer } from "@repo/schema/player"

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

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"
import { useRoomKickEvent } from "@/hooks/event/use-room-kick-event"

type JoinedPlayerProps = {
  player: RoomPlayer
}

const JoinedPlayer = ({ player }: JoinedPlayerProps) => {
  const { handleKickPlayer } = useRoomKickEvent()

  const { status } = useRoomStore((state) => state.room)
  const currentPlayer = useRoomStore((state) => state.currentRoomPlayer)

  const { elo: eloStat } = getRendererPlayerStats(player, ["elo"])
  const isOffline = player.connection.status === "offline"

  return (
    <HoverActionOverlay className={cn("py-4 flex flex-col items-center justify-center gap-y-2 relative", {
      "opacity-40": isOffline
    })}
      hoverAction={handleKickPlayer}
      disableOverlay={player.role === "owner" || currentPlayer.role === "guest" || status !== "joined"}
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
      
      <StatisticBadge className={cn({ "opacity-80": player.stats.elo < 0 })}
        variant={player.stats.elo < 0 ? "destructive" : "accent"}
        statistic={eloStat}
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

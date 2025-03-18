"use client"

import { useMemo } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"

// helpers
import { calculateElo } from "@repo/helper/elo"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleFadingArrowUp, Sigma, Trophy } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { GlowingOverlay, StatisticBadge } from "@/components/shared"
import { PlayerBadge } from "@/components/player"
import { UserAvatar } from "@/components/user"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

type SessionFooterPlayerProps = {
  player: ClientPlayer
  flipOrder?: boolean
}

const SessionFooterPlayer = ({ player, flipOrder }: SessionFooterPlayerProps) => {
  const session = useSessionStore((state) => state.session)

  const { gainedElo } = useMemo(() => calculateElo(session, player.id), [session, player])
  const flips = session.stats.flips[player.id]

  return (
    <GlowingOverlay className={cn("w-full flex justify-between items-center gap-x-3 hover:scale-100", {
      "flex-row-reverse": flipOrder
    })}
      overlayProps={{
        className: cn("bg-accent opacity-30 dark:opacity-10 blur-md rounded-3xl", {
          "animate-in slide-in-from-right fade-in-40 dark:fade-in-15 duration-500": session.owner.id === player.id,
          "animate-in slide-in-from-left fade-in-40 dark:fade-in-15 duration-500": (session.format === "PVP" || session.format === "COOP") && session.guest.id === player.id
        })
      }}
      disableOverlay={session.format === "SOLO" || session.currentTurn !== player.id}
    >
      <div className="space-y-1.5">
        <div className={cn("flex items-center gap-x-2", { "flex-row-reverse": flipOrder })}>
          <UserAvatar user={{
            imageUrl: player.imageUrl,
            username: player.tag
          }} />

          <PlayerBadge player={player} />
        </div>

        <StatisticBadge className="font-medium"
          variant={player.stats.elo === 0 ? "default" : player.stats.elo > 0 ? "accent" : "destructive"}
          Icon={Trophy}
          iconProps={{ className: "size-3.5" }}
        >
          <span className="small-caps tracking-wider">Rank / </span>
          <span className="text-xs font-semibold dark:font-medium">
            {player.stats.elo} Elo
          </span>
        </StatisticBadge>
      </div>

      <div className="space-y-1.5">
        <Badge className={cn("w-fit ml-auto flex items-center gap-x-1.5", { "mr-auto ml-0": flipOrder })}
          variant="outline"
        >
          <Sigma className="size-4 shrink-none" />

          <p className="space-x-1 text-sm small-caps">
            {flips} flips
          </p>
        </Badge>

        <Badge className={cn("w-fit ml-auto flex items-center gap-x-1.5", {
          "opacity-40": session.mode === "CASUAL",
          "mr-auto ml-0": flipOrder
        })}
          variant={gainedElo === 0 ? "muted" : gainedElo > 0 ? "accent" : "destructive"}
        >
          <CircleFadingArrowUp className={cn("size-4 shrink-none", { "rotate-180": gainedElo < 0 })} />

          <p className="space-x-1">
            <span className="text-sm font-light small-caps">Session</span>
            <span className="text-xs font-semibold">/ {gainedElo} Elo</span>
          </p>
        </Badge>
      </div>
    </GlowingOverlay>
  )
}

const SessionPlayerSkeleton = ({ flipOrder }: { flipOrder?: boolean }) => (
  <div className={cn("w-full flex justify-between items-center gap-x-3", { "flex-row-reverse": flipOrder })}>
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-x-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="flex-1 max-w-28 h-5 rounded-full" />
      </div>

      <Skeleton className="flex-1 max-w-28 h-5" />
    </div>

    <div className="flex-1 space-y-2">
      <Skeleton className="max-w-32 h-5 ml-auto" />
      <Skeleton className="max-w-24 h-5 ml-auto" />
    </div>
  </div>
)

export default SessionFooterPlayer
export { SessionPlayerSkeleton }

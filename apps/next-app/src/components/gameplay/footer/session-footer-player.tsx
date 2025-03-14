"use client"

import { useMemo } from "react"

// types
import type { ClientSessionVariants } from "@repo/schema/session"
import type { ClientPlayer } from "@repo/schema/player"

// helpers
import { calculatePlayerSessionScore, getFreeFlips } from "@repo/helper/session"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleFadingArrowUp, Sigma, Trophy } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { UserAvatar } from "@/components/user"
import { PlayerBadge } from "@/components/player"
import { GlowingOverlay, StatisticBadge } from "@/components/shared"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

type SessionFooterPlayerProps = {
  player: ClientPlayer
  flipOrder?: boolean
}

const SessionFooterPlayer = ({ player, flipOrder }: SessionFooterPlayerProps) => {
  const session = useSessionStore((state) => state.session)

  const freeFlips = useMemo(() => getFreeFlips(session), [session])
  const elo = useMemo(() => calculatePlayerSessionScore(session, player.id), [session, player.id])

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
          variant={player.stats.elo < 0 ? 'destructive' : 'accent'}
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
          <Sigma className="size-4 flex-none" />

          <p className="space-x-1">
            <span className="text-sm small-caps">
              {flips} flips
            </span>

            {freeFlips !== null && (
              <span className="text-xs">
                / {freeFlips} free
              </span>
            )}
          </p>
        </Badge>

        {elo !== null && (
          <Badge className={cn("w-fit ml-auto flex items-center gap-x-1.5", { "mr-auto ml-0": flipOrder })}
            variant={elo >= 0 ? 'accent' : 'destructive'}
          >
            <CircleFadingArrowUp className={cn("size-4 flex-none", { "rotate-180": elo < 0 })} />
  
            <p className="space-x-1">
              <span className="text-sm font-light small-caps">Session</span>
              <span className="text-xs font-semibold">/ {elo} Elo</span>
            </p>
          </Badge>
        )}
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

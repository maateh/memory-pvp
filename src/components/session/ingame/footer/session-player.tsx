// helpers
import { calculateSessionScore, getFreeFlips } from "@/lib/helpers/session"

// utils
import { cn } from "@/lib/utils"

// icons
import { CircleFadingArrowUp, Sigma, Trophy } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { StatisticBadge } from "@/components/shared"
import { PlayerWithAvatar } from "@/components/player"

type SessionPlayerProps = {
  player: ClientPlayer
  session: ClientGameSession
  flipOrder?: boolean
}

const SessionPlayer = ({ player, session, flipOrder }: SessionPlayerProps) => {
  const flips = session.stats.flips[player.tag]

  const freeFlips = getFreeFlips(session)
  const score = calculateSessionScore(session, player.tag)

  return (
    <div className={cn("w-full flex justify-between items-center gap-x-3", { "flex-row-reverse": flipOrder })}>
      <div className="space-y-1.5">
        <PlayerWithAvatar className={cn({ "flex-row-reverse": flipOrder })}
          player={player}
        />

        <StatisticBadge className="font-medium"
          variant={player.stats.score < 0 ? 'destructive' : 'accent'}
          Icon={Trophy}
          iconProps={{ className: "size-3.5" }}
        >
          <span className="small-caps tracking-wider">Rank / </span>
          <span className="text-xs font-semibold dark:font-medium">
            {player.stats.score} scores
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

        {score !== null && (
          <Badge className={cn("w-fit ml-auto flex items-center gap-x-1.5", { "mr-auto ml-0": flipOrder })}
            variant={score >= 0 ? 'accent' : 'destructive'}
          >
            <CircleFadingArrowUp className={cn("size-4 flex-none", { "rotate-180": score < 0 })} />
  
            <p className="space-x-1">
              <span className="text-sm font-light small-caps">Session</span>
              <span className="text-xs font-semibold">/ {score} scores</span>
            </p>
          </Badge>
        )}
      </div>
    </div>
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

export default SessionPlayer
export { SessionPlayerSkeleton }

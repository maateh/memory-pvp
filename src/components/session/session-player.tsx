// utils
import { cn } from "@/lib/utils"

// icons
import { ScanEye, Sparkles } from "lucide-react"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { PlayerWithAvatar } from "@/components/player"

type SessionPlayerProps = {
  player: PlayerProfileWithUserAvatar
  flipOrder?: boolean
}

const SessionPlayer = ({ player, flipOrder }: SessionPlayerProps) => {
  const sessionScore = 5
  const overallScore = 100

  const freeFlips = 10
  const flipCounter = 4

  return (
    <div className={cn("w-full flex justify-between items-center gap-x-3", { "flex-row-reverse": flipOrder })}>
      <div className="space-y-1">
        <PlayerWithAvatar className={cn({ "flex-row-reverse": flipOrder })}
          player={player}
          imageUrl={player.user.imageUrl}
        />

        <div className="flex items-center gap-x-1.5">
          <Sparkles className="size-4 flex-none" />
          <p className="text-sm font-light">
            {overallScore} points
          </p>
          <span className="font-heading font-semibold">(+{freeFlips - flipCounter})</span>
        </div>
      </div>

      <div>
        <div className={cn("mb-1 flex flex-wrap items-center gap-x-1.5", { "flex-row-reverse text-end": !flipOrder })}>
          <ScanEye className="size-5 flex-none" strokeWidth={1.5} />
          <p className="font-light small-caps">Flip counter</p>
        </div>

        <p className={cn("font-heading font-medium", { "text-end": !flipOrder })}>
          {flipCounter} flips
        </p>
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

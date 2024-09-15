// utils
import { cn } from "@/lib/utils"

// icons
import { ScanEye, Sparkles } from "lucide-react"

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

export default SessionPlayer

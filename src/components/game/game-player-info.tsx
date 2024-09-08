import Image from "next/image"

// prisma
import { db } from "@/server/db"

// utils
import { cn } from "@/lib/utils"

// icons
import { ScanEye, Sparkles, User } from "lucide-react"

// components
import { PlayerBadge } from "@/components/player"

type GamePlayerInfoProps = {
  playerTag: string
  flipOrder?: boolean
}

const GamePlayerInfo = async ({ playerTag, flipOrder }: GamePlayerInfoProps) => {
  const player = await db.playerProfile.findUnique({
    where: {
      tag: playerTag
    },
    include: {
      user: {
        select: {
          imageUrl: true
        }
      }
    }
  })

  if (!player) {
    // TODO: handle it
    return
  }

  const sessionScore = 5
  const overallScore = 100

  const freeFlips = 10
  const flipCounter = 4

  return (
    <div className={cn("w-full flex justify-between items-center gap-x-3", { "flex-row-reverse": flipOrder })}>
      <div className="space-y-1">
        <div className={cn("flex items-center gap-x-2", { "flex-row-reverse": flipOrder })}>
          {player.user.imageUrl ? (
            <div className="size-6 border border-border/50 rounded-full img-wrapper">
              <Image
                src={player.user.imageUrl}
                alt={`${player.tag}'s avatar`}
                fill
              />
            </div>
          ) : <User className="size-6 border border-border/50 rounded-full" />}

          <PlayerBadge className={cn("w-fit", { "ml-auto": flipOrder })}
            player={{
              tag: player.tag,
              color: player.color,
              isActive: false
            }}
          />
        </div>

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

export default GamePlayerInfo

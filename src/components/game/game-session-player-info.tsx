import Image from "next/image"

// prisma
import { db } from "@/server/db"

// utils
import { cn } from "@/lib/utils"

// icons
import { ScanEye, Sparkles, SquareUser } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerBadge } from "@/components/player"

type GameSessionPlayerInfoProps = {
  playerTag: string
  flipOrder?: boolean
}

const GameSessionPlayerInfo = async ({ playerTag, flipOrder }: GameSessionPlayerInfoProps) => {
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

  const flipCounter = 5
  const freeFlips = 10

  return (
    <div className={cn("flex-1 flex justify-between items-center", { "flex-row-reverse": flipOrder })}>
      <div className={cn("flex items-center gap-x-4", { "flex-row-reverse": flipOrder })}>
        {player.user.imageUrl ? (
          <div className="size-8 rounded-full img-wrapper">
            <Image
              src={player.user.imageUrl}
              alt={`${player.tag}'s avatar`}
              fill
            />
          </div>
        ) : <SquareUser className="size-7" />}
        <div className={cn("space-y-1", { "text-end": flipOrder })}>
          <PlayerBadge className={cn("w-fit", { "ml-auto": flipOrder })}
            player={{
              tag: player.tag,
              color: player.color,
              isActive: false
            }}
          />

          <div className="flex items-center gap-x-1.5">
            <Sparkles className="size-4" />
            <p className="text-sm font-light">
              {overallScore} points
            </p>
            <span className="font-heading font-semibold">(+{sessionScore})</span>
          </div>
        </div>
      </div>

      <div>
        <div className={cn("mb-1 flex items-center gap-x-1.5", { "flex-row-reverse": !flipOrder })}>
          <ScanEye className="size-5" strokeWidth={1.5} />
          <p className="font-light small-caps">Round&apos;s flips</p>
        </div>

        <div className={cn("flex gap-x-2.5 md:flex-col", { "flex-row-reverse text-end": !flipOrder })}>
          <p className="font-heading dark:font-light">
            Counter: <span className="font-medium">{flipCounter}</span>
          </p>

          <Separator className="h-3.5 my-auto bg-input/65 md:hidden"
            orientation="vertical"
          />

          <p className="font-heading dark:font-light">
            Free: <span className="font-medium">{freeFlips}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameSessionPlayerInfo

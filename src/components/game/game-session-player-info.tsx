import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

type GameSessionPlayerInfoProps = {
  playerName: string
  userAvatar: string
  overallScore: number
  sessionScore: number
  flipOrder?: boolean
}

const GameSessionPlayerInfo = ({
  playerName,
  userAvatar,
  overallScore,
  sessionScore,
  flipOrder
}: GameSessionPlayerInfoProps) => {
  return (
    <div className={cn("flex-1 flex justify-between items-center", { 'flex-row-reverse': flipOrder })}>
      <div className={cn("flex items-center gap-x-4", { 'flex-row-reverse': flipOrder })}>
        <div className="relative size-8 rounded-full overflow-hidden">
          <Image className="object-cover"
            src={userAvatar}
            alt="user avatar"
            fill
          />
        </div>
        <p className="text-lg font-bold small-caps">
          {playerName}
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm font-light">
          Overall score: <span>{overallScore}</span>
        </p>
        <p className="font-normal">
          Session score: <span>+{sessionScore}</span>
        </p>
      </div>
    </div>
  )
}

export default GameSessionPlayerInfo

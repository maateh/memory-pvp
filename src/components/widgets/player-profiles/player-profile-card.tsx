"use client"

// prisma
import { PlayerProfile } from "@prisma/client"

// icons
import { Edit, ShieldCheck, Star, Trash2 } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// components
import { ColorPicker } from "@/components/inputs"

type PlayerProfileCardProps = {
  player: PlayerProfile
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  return (
    <div className="py-2.5 px-3 flex justify-between items-center rounded-lg hover:bg-transparent/5 dark:hover:bg-transparent/20">
      <div className="flex gap-x-4 items-center">
        <ColorPicker className="size-4 border"
          value={player.color}
          onChange={() => {}}
        />

        <div className="leading-snug">
          <div className="flex items-center gap-x-2">
            <p className="font-light">
              {player.tag}
            </p>

            {player.isActive && (
              <ShieldCheck className="inline size-4 text-secondary" />
            )}
          </div>

          <div className="flex items-center gap-x-1.5 text-sm font-extralight small-caps">
            <Star className="size-3.5" />
            <span>Total score - {player.totalScore} points</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <ButtonTooltip className="p-1.5"
          tooltip="Edit player profile"
          variant="ghost"
          size="icon"
          onClick={() => {}}
        >
          <Edit className="size-5" />
        </ButtonTooltip>

        <ButtonTooltip className="p-1.5"
          tooltip="Remove player profile"
          variant="destructive"
          size="icon"
          onClick={() => {}}
        >
          <Trash2 className="size-4" />
        </ButtonTooltip>
      </div>
    </div>
  )
}

export default PlayerProfileCard

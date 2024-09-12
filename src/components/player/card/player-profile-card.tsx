"use client"

import { useRef, useState } from "react"

// prisma
import { PlayerProfile } from "@prisma/client"

// lib
import { cn } from "@/lib/utils"

// icons
import { Star } from "lucide-react"

// shadcn
import { Input } from "@/components/ui/input"

// components
import { ColorPicker } from "@/components/inputs"
import { PlayerVerifiedBadge } from "@/components/player"

// hooks
import PlayerProfileActions from "./player-profile-actions"

type PlayerProfileCardProps = {
  player: PlayerProfile
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState(false)

  const [playerTag, setPlayerTag] = useState(player.tag)
  const [color, setColor] = useState(player.color)

  return (
    <div className="py-2.5 px-3 flex justify-between items-center rounded-lg hover:bg-transparent/5 dark:hover:bg-transparent/20">
      <div className="flex gap-x-3 items-center">
        <div className={cn("p-1.5 flex items-center justify-center rounded-xl", {
          "bg-transparent/5 dark:bg-transparent/20 border border-border/25": editing
        })}>
          <ColorPicker className="size-4 border"
            value={color}
            onChange={setColor}
            disabled={!editing}
          />
        </div>

        <div className="leading-snug">
          <div className="flex items-center gap-x-2">
            {editing ? (
              <Input className="h-fit py-0.5 mb-0.5 border-input/40"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
              />
            ) : (
              <p className="font-light">
                {player.tag}
              </p>
            )}

            {player.isActive && <PlayerVerifiedBadge />}
          </div>

          <div className="flex items-center gap-x-1.5 text-sm font-extralight small-caps">
            <Star className="size-3.5" />
            <span>Total score - {player.totalScore} points</span>
          </div>
        </div>
      </div>

      <PlayerProfileActions
        player={player}
        updatedPlayer={{
          tag: playerTag,
          color: color
        }}
        editing={editing}
        setEditing={setEditing}
        setColor={setColor}
      />
    </div>
  )
}

export default PlayerProfileCard

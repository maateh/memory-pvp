"use client"

import { useState } from "react"

// prisma
import { PlayerProfile } from "@prisma/client"

// lib
import { cn } from "@/lib/utils"

// icons
import { CheckCircle2, Loader2, Star, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// components
import { ColorPicker } from "@/components/inputs"
import { PlayerVerifiedBadge } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

// hooks
import { useDeletePlayerMutation, useUpdatePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerProfileCardProps = {
  player: PlayerProfile
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState<boolean>(false)

  const [updatedPlayer, setUpdatedPlayer] = useState<Pick<PlayerProfile, 'tag' | 'color'>>({
    tag: player.tag,
    color: player.color
  })

  const { updatePlayer, handleUpdatePlayer } = useUpdatePlayerMutation()
  const { deletePlayer } = useDeletePlayerMutation()

  const handleToggleEditing = () => {
    setEditing((editing) => {
      if (editing) setUpdatedPlayer(player)
      return !editing
    })
  }

  return (
    <>
      <div className="flex gap-x-3 items-center">
        <div className={cn("p-1.5 flex items-center justify-center rounded-xl", {
          "bg-transparent/5 dark:bg-transparent/20 border border-border/25": editing
        })}>
          <ColorPicker className="size-4 border"
            value={updatedPlayer.color}
            onChange={(color) => setUpdatedPlayer((prev) => ({ ...prev, color }))}
            disabled={!editing}
          />
        </div>

        <div className="leading-snug">
          <div className="flex items-center gap-x-2">
            {editing ? (
              <Input className="h-fit py-0.5 mb-0.5 border-input/40"
                value={updatedPlayer.tag}
                onChange={(e) => setUpdatedPlayer((prev) => ({ ...prev, tag: e.target.value }))}
              />
            ) : (
              <p className="font-heading font-semibold">
                {player.tag}
              </p>
            )}

            {player.isActive && <PlayerVerifiedBadge />}
          </div>

          <div className="flex items-center gap-x-1.5 text-sm font-extralight small-caps">
            <Star className="size-3.5 flex-none" />
            {/* TODO: GET -> Total score */}
            <span>Total score - 50 points</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2.5">
        <div className={cn("flex gap-x-1", { "hidden": !editing })}>
          <ButtonTooltip className="p-1"
            tooltip="Save changes"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdatePlayer({
              player,
              updatedPlayer,
              resetEditing: () => setEditing(false)
            })}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            {updatePlayer.isPending ? (
              <Loader2 className="size-[1.125rem] text-accent animate-spin flex-none" />
            ) : (
              <CheckCircle2 className="size-[1.125rem] text-accent flex-none" />
            )}
          </ButtonTooltip>

          <ButtonTooltip className="p-1"
            tooltip="Cancel"
            variant="ghost"
            size="icon"
            onClick={handleToggleEditing}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            <XCircle className="size-[1.125rem] text-destructive flex-none" />
          </ButtonTooltip>
        </div>

        <PlayerActionsDropdown
          player={player}
          editing={editing}
          toggleEditing={handleToggleEditing}
        />
      </div>
    </>
  )
}

export default PlayerProfileCard

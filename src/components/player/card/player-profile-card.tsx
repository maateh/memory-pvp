"use client"

import { useState } from "react"

// lib
import { cn } from "@/lib/utils"

// icons
import { CheckCircle2, Loader2, Star, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// components
import { ColorPicker } from "@/components/inputs"
import { PlayerStatBadge, PlayerVerifiedBadge } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

// hooks
import { useDeletePlayerMutation, useUpdatePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerProfileCardProps = {
  player: ClientPlayer
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState<boolean>(false)

  const [updatedPlayer, setUpdatedPlayer] = useState<Pick<ClientPlayer, 'tag' | 'color'>>({
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
          <ColorPicker className="size-4 border disabled:opacity-100"
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

          <PlayerStatBadge className="px-1.5 dark:font-light bg-muted/50 text-foreground/80 hover:bg-muted/65 hover:text-foreground/90 rounded-xl"
            Icon={Star}
          >
            Total score | <span className="font-semibold dark:font-medium">{player.stats.score} points</span>
          </PlayerStatBadge>
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

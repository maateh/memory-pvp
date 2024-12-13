"use client"

import { useState } from "react"

// utils
import { cn } from "@/lib/util"
import { logError } from "@/lib/util/error"

// icons
import { CheckCircle2, Hash, Loader2, XCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import { ColorPicker } from "@/components/input"
import { PlayerStatsRenderer, PlayerVerified } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

// hooks
import { useUpdatePlayerAction } from "@/lib/safe-action/player"

type PlayerProfileCardProps = {
  player: ClientPlayer
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [updatedPlayer, setUpdatedPlayer] = useState<Pick<ClientPlayer, 'tag' | 'color'>>({
    tag: player.tag,
    color: player.color
  })

  const { executeAsync: executeUpdatePlayer, status: updatePlayerStatus } = useUpdatePlayerAction()

  const handleToggleEditing = () => {
    setEditing((editing) => {
      if (editing) setUpdatedPlayer(player)
      return !editing
    })
  }

  const handleExecute = async () => {
    try {
      await executeUpdatePlayer({
        previousTag: player.tag,
        ...updatedPlayer
      })
      setEditing(false)
    } catch (err) {
      logError(err)
    }
  }

  return (
    <>
      <div className="py-1 flex gap-x-3 items-center">
        <ColorPicker className={cn("border border-border/5 disabled:opacity-100", {
          "bg-foreground/5 border-2 border-border/20": editing
        })}
          value={updatedPlayer.color}
          onChange={(color) => setUpdatedPlayer((prev) => ({ ...prev, color }))}
          disabled={!editing}
        >
          <Hash className="size-4"
            style={{ color: updatedPlayer.color }}
            strokeWidth={editing ? 4 : 2.5}
          />
        </ColorPicker>

        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <Separator className="w-1 h-4 rounded-full"
              style={{ backgroundColor: updatedPlayer.color }}
            />

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

            {player.isActive && <PlayerVerified showTooltip />}
          </div>

          <PlayerStatsRenderer player={player} />
        </div>
      </div>

      <div className="ml-2.5 sm:ml-6 flex items-center gap-x-2.5">
        <div className={cn("flex gap-x-1", { "hidden": !editing })}>
          <Button className="p-1"
            tooltip="Save changes"
            variant="ghost"
            size="icon"
            onClick={handleExecute}
            disabled={updatePlayerStatus === 'executing'}
          >
            {updatePlayerStatus === 'executing' ? (
              <Loader2 className="size-[1.125rem] text-accent animate-spin flex-none" />
            ) : (
              <CheckCircle2 className="size-[1.125rem] text-accent flex-none" />
            )}
          </Button>

          <Button className="p-1"
            tooltip="Cancel"
            variant="ghost"
            size="icon"
            onClick={handleToggleEditing}
            disabled={updatePlayerStatus === 'executing'}
          >
            <XCircle className="size-[1.125rem] text-destructive flex-none" />
          </Button>
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

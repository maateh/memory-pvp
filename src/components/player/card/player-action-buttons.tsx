"use client"

import { useState } from "react"

// prisma
import { PlayerProfile } from "@prisma/client"

// icons
import { CheckCircle2, Edit, Loader2, ShieldPlus, Trash2, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// components
import PlayerDeleteWarning from "./player-delete-warning"

// hooks
import {
  useDeletePlayerMutation,
  useSelectAsActiveMutation,
  useUpdatePlayerMutation
} from "@/lib/react-query/mutations/player"

type PlayerActionButtonsProps = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
  editing: boolean
  setEditing: (editing: boolean) => void
  setColor: (color: string) => void
}

const PlayerActionButtons = ({
  player,
  updatedPlayer,
  editing,
  setEditing,
  setColor
}: PlayerActionButtonsProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const { updatePlayer, handleUpdatePlayer } = useUpdatePlayerMutation({ setEditing })
  const { deletePlayer } = useDeletePlayerMutation()
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <div className="flex items-center gap-x-2.5">
      {editing ? (
        <>
          <ButtonTooltip className="p-1"
            tooltip="Save changes"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdatePlayer({ player, updatedPlayer })}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            {updatePlayer.isPending ? (
              <Loader2 className="size-5 text-accent animate-spin" />
            ) : (
              <CheckCircle2 className="size-5 text-accent" />
            )}
          </ButtonTooltip>

          <ButtonTooltip className="p-1"
            tooltip="Cancel"
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditing(false)
              setColor(player.color)
            }}
            disabled={updatePlayer.isPending}
          >
            <XCircle className="size-5 text-destructive" />
          </ButtonTooltip>
        </>
      ) : (
        <>
          {!player.isActive && (
            <ButtonTooltip className="p-1"
              tooltip={(
                <div className="flex items-center gap-x-2">
                  <ShieldPlus className="size-4" />
                  <p>
                    Select as <span className="text-accent font-medium">active</span>
                  </p>
                </div>
              )}
              variant="ghost"
              size="icon"
              onClick={() => handleSelectAsActive(player)}
              disabled={selectAsActive.isPending || deletePlayer.isPending}
            >
              {selectAsActive.isPending ? (
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              ) : (
                <ShieldPlus className="size-4 text-muted-foreground" />
              )}
            </ButtonTooltip>
          )}

          <ButtonTooltip className="p-1.5"
            tooltip="Edit player profile"
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            disabled={updatePlayer.isPending || selectAsActive.isPending || deletePlayer.isPending}
          >
            <Edit className="size-5" />
          </ButtonTooltip>

          {!player.isActive && (
            <>
              <ButtonTooltip className="p-1.5"
                tooltip="Delete player profile"
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteWarning(true)}
                disabled={deletePlayer.isPending || updatePlayer.isPending || selectAsActive.isPending}
              >
                {deletePlayer.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </ButtonTooltip>

              <PlayerDeleteWarning
                player={player}
                open={showDeleteWarning}
                onOpenChange={() => setShowDeleteWarning(false)}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default PlayerActionButtons

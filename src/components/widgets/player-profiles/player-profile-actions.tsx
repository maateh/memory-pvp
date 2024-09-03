"use client"

// prisma
import { PlayerProfile } from "@prisma/client"

// icons
import { CheckCircle2, Edit, ShieldPlus, Trash2, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// hooks
import { useDeletePlayer, useSelectAsActive, useUpdatePlayer } from "./queries"

type PlayerProfileActionsProps = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
  editing: boolean
  setEditing: (editing: boolean) => void
  setColor: (color: string) => void
}

const PlayerProfileActions = ({
  player,
  updatedPlayer,
  editing,
  setEditing,
  setColor
}: PlayerProfileActionsProps) => {
  const { updatePlayer, handleUpdatePlayer } = useUpdatePlayer({
    player,
    updatedPlayer,
    setEditing
  })

  const { deletePlayer, handleDeletePlayer } = useDeletePlayer({ player })
  const { selectAsActive, handleSelectAsActive } = useSelectAsActive({ player })

  return (
    <div className="flex items-center gap-x-2.5">
      {editing ? (
        <>
          <ButtonTooltip className="p-1"
            tooltip="Save changes"
            variant="ghost"
            size="icon"
            onClick={handleUpdatePlayer}
            disabled={updatePlayer.isPending}
          >
            <CheckCircle2 className="size-5 text-accent" />
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
              onClick={handleSelectAsActive}
              disabled={selectAsActive.isPending || deletePlayer.isPending}
            >
              <ShieldPlus className="size-4 text-muted-foreground" />
            </ButtonTooltip>
          )}

          <ButtonTooltip className="p-1.5"
            tooltip="Edit player profile"
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            <Edit className="size-5" />
          </ButtonTooltip>

          {!player.isActive && (
            <ButtonTooltip className="p-1.5"
              tooltip="Delete player profile"
              variant="destructive"
              size="icon"
              onClick={handleDeletePlayer} // TODO: show confirm before deletion
              disabled={deletePlayer.isPending || updatePlayer.isPending}
            >
              <Trash2 className="size-4" />
            </ButtonTooltip>
          )}
        </>
      )}
    </div>
  )
}

export default PlayerProfileActions
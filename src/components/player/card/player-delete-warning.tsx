"use client"

// types
import type { PlayerProfile } from "@prisma/client"
import type { DialogProps } from "@radix-ui/react-dialog"

// components
import { WarningActionButton, WarningCancelButton, WarningModal, WarningModalFooter } from "@/components/shared"

// hooks
import { useDeletePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerDeleteWarningProps = {
  player: PlayerProfile
} & DialogProps

const PlayerDeleteWarning = ({ player, ...props }: PlayerDeleteWarningProps) => {
  const { deletePlayer, handleDeletePlayer } = useDeletePlayerMutation()

  return (
    <WarningModal
      title="Delete player profile"
      description="Are you sure you want to delete this player profile?"
      {...props}
    >
      {/* TODO: display player stats here */}

      <WarningModalFooter>
        <WarningCancelButton onClick={() => props.onOpenChange && props.onOpenChange(false)}>
          Cancel
        </WarningCancelButton>

        <WarningActionButton
          onClick={() => handleDeletePlayer(player)}
          disabled={deletePlayer.isPending}
        >
          Delete
        </WarningActionButton>
      </WarningModalFooter>
    </WarningModal>
  )
}

export default PlayerDeleteWarning

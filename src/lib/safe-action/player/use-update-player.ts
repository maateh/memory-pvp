import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { updatePlayer } from "@/server/actions/player-action"

// utils
import { handleServerError } from "@/lib/utils/error"

export const useUpdatePlayerAction = () => useAction(updatePlayer, {
  onSuccess({ data: player }) {
    if (!player) return

    toast.success('Player updated!', {
      description: `Updated player name: ${player.tag}`
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to update player. Please try again later.')
  }
})

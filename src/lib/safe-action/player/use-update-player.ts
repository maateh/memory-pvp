import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { updatePlayer } from "@/server/actions/player"

// utils
import { handleActionError } from "@/lib/utils"

export const useUpdatePlayerAction = () => useAction(updatePlayer, {
  onSuccess({ data: player }) {
    if (!player) return

    toast.success('Player updated!', {
      description: `Updated player name: ${player.tag}`
    })
  },
  onError({ error }) {
    handleActionError(error.serverError, 'Failed to update player. Please try again later.')
  }
})

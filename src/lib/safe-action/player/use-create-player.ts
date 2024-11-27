import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { createPlayer } from "@/server/actions/player"

// utils
import { handleActionError } from "@/lib/utils"

export const useCreatePlayerAction = () => useAction(createPlayer, {
  onSuccess({ data: player }) {
    if (!player) return

    toast.success('Player created!', {
      description: `You have created a new player: ${player.tag}`
    })
  },
  onError({ error }) {
    handleActionError(error.serverError, 'Failed to create player. Please try again later.')
  }
})

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { createPlayer } from "@/server/action/player-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useCreatePlayerAction = () => useAction(createPlayer, {
  onSuccess({ input: player }) {
    toast.success('Player created!', {
      description: `You have created a new player: ${player.tag}`
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to create player. Please try again later.')
  }
})

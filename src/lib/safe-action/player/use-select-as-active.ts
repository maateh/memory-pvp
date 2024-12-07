import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { selectPlayerAsActive } from "@/server/actions/player-action"

// utils
import { handleServerError } from "@/lib/utils/error"

export const useSelectAsActiveAction = () => useAction(selectPlayerAsActive, {
  onSuccess({ data: player }) {
    if (!player) return

    toast.success('Active player selected!', {
      description: `You have selected ${player.tag} as your active player.`
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to select player as active. Please try again later.')
  }
})

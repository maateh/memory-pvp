import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { updatePlayer } from "@/server/action/player-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useUpdatePlayerAction = () => {
  const router = useRouter()

  return useAction(updatePlayer, {
    onSuccess({ input: player }) {
      router.back()
      toast.success('Player updated!', {
        description: `Updated player name: ${player.tag}`
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to update player. Please try again later.')
    }
  })
}

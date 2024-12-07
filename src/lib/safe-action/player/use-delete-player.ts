import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { deletePlayer } from "@/server/actions/player"

// utils
import { handleServerError } from "@/lib/utils/error"

export const useDeletePlayerAction = () => {
  const router = useRouter()

  return useAction(deletePlayer, {
    onSuccess({ data: player }) {
      if (!player) return
  
      toast.warning('Player deleted!', {
        description: `You've deleted this player profile: ${player.tag}`
      })
  
      router.back()
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to delete player profile. Please try again later.')
    }
  })
}

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type HandleDeletePlayerParams = {
  player: Pick<ClientPlayer, 'tag' | 'isActive'>
  closeDialog: () => void
}

export const useDeletePlayerMutation = () => {
  const router = useRouter()

  const deletePlayer = api.playerProfile.delete.useMutation({
    onSuccess: async ({ tag }) => {
      toast.warning('Player deleted!', {
        description: `You've deleted this player profile: ${tag}`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to delete player profile. Please try again later.')
    }
  })

  const handleDeletePlayer = async ({ player, closeDialog }: HandleDeletePlayerParams) => {
    if (player.isActive) {
      toast.warning(`${player.tag} cannot be deleted!`, {
        description: "You can't delete an active player profile."
      })
      return
    }

    try {
      await deletePlayer.mutateAsync(player.tag)
      closeDialog()
    } catch (err) {
      logError(err)
    }
  }

  return { deletePlayer, handleDeletePlayer }
}

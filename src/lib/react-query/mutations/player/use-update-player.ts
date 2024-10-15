import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type HandleUpdatePlayerParams = {
  player: ClientPlayer
  updatedPlayer: Pick<ClientPlayer, 'tag' | 'color'>
  resetEditing: () => void
}

export const useUpdatePlayerMutation = () => {
  const router = useRouter()

  const updatePlayer = api.playerProfile.update.useMutation({
    onSuccess: async ({ tag }) => {
      toast.success('Player updated!', {
        description: `You've updated this player profile: ${tag}`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to update player profile. Please try again later.')
    }
  })

  const handleUpdatePlayer = async ({ player, updatedPlayer, resetEditing }: HandleUpdatePlayerParams) => {
    const { tag, color } = updatedPlayer

    if (tag === player.tag && color === player.color) {
      resetEditing()
      return
    }

    try {
      await updatePlayer.mutateAsync({
        playerId: player.id, // FIXME: missing id
        playerTag: tag,
        color
      })

      resetEditing()
    } catch (err) {
      logError(err)
    }
  }

  return { updatePlayer, handleUpdatePlayer }
}

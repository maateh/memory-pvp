import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import type { PlayerProfile } from "@prisma/client"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type HandleUpdatePlayerParams = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
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
        playerId: player.id,
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

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError } from "@/lib/utils"

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

  const handleDeletePlayer = async (player: PlayerProfile) => {
    if (player.isActive) {
      toast.warning(`${player.tag} cannot be deleted!`, {
        description: "You can't delete an active player profile."
      })
      return
    }

    await deletePlayer.mutateAsync({ playerId: player.id })
  }

  return { deletePlayer, handleDeletePlayer }
}

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

export const useDeletePlayerMutation = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const deletePlayer = api.playerProfile.delete.useMutation({
    onSuccess: async (player) => {
      toast.warning('Player deleted!', {
        description: `You've deleted your player profile: ${player.tag}`
      })

      router.refresh()
      await utils.playerProfile.getAll.invalidate()
    },
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('Active player profiles cannot be deleted!', {
          description: "Please try select another player as active before you delete this one."
        })
        return
      }

      toast.error('Something went wrong.', {
        description: 'Failed to delete player profile. Please try again later.'
      })
    }
  })

  const handleDeletePlayer = async (player: PlayerProfile) => {
    if (player.isActive) {
      toast.warning(`${player.tag} cannot be deleted!`, {
        description: "You can't delete an active player profile."
      })
      return
    }

    try {
      await deletePlayer.mutateAsync({ playerId: player.id })
    } catch (err) {
      throw new TRPCClientError('Failed to delete player profile.', { cause: err as Error })
    }
  }

  return { deletePlayer, handleDeletePlayer }
}

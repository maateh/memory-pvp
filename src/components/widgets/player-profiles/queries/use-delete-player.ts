import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

export const useDeletePlayer = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const deletePlayer = api.playerProfile.delete.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      // TODO: add toast
    }
  })

  const handleDeletePlayer = async (player: PlayerProfile) => {
    if (player.isActive) {
      // TODO: add toast
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

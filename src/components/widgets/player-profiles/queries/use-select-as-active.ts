import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

export const useSelectAsActive = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const selectAsActive = api.playerProfile.selectAsActive.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      // TODO: add toast
    }
  })

  const handleSelectAsActive = async (player: PlayerProfile) => {
    if (player.isActive) {
      // TODO: add toast
    }

    try {
      await selectAsActive.mutateAsync({ playerId: player.id })
    } catch (err) {
      throw new TRPCClientError('Failed to update player profile.', { cause: err as Error })
    }
  }

  return { selectAsActive, handleSelectAsActive }
}

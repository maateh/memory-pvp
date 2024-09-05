import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

export const useSelectAsActive = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const selectAsActive = api.playerProfile.selectAsActive.useMutation({
    onSuccess: async (player) => {
      toast.success('Player selected!', {
        description: `You've selected ${player.tag} as your active player profile.`
      })

      router.refresh()
      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      toast.error('Something went wrong.', {
        description: 'Failed to select player profile as active. Please try again later.'
      })
    }
  })

  const handleSelectAsActive = async (player: PlayerProfile) => {
    if (player.isActive) return

    try {
      await selectAsActive.mutateAsync({ playerId: player.id })
    } catch (err) {
      throw new TRPCClientError('Failed to update player profile.', { cause: err as Error })
    }
  }

  return { selectAsActive, handleSelectAsActive }
}

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// utils
import { handleApiError } from "@/lib/utils"

export const useSelectAsActiveMutation = () => {
  const router = useRouter()

  const selectAsActive = api.playerProfile.selectAsActive.useMutation({
    onSuccess: async (player) => {
      toast.success('Player selected!', {
        description: `You've selected ${player.tag} as your active player profile.`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to select player profile as active. Please try again later.')
    }
  })

  const handleSelectAsActive = async (player: PlayerProfile) => {
    if (player.isActive) return

    await selectAsActive.mutateAsync({ playerId: player.id })
  }

  return { selectAsActive, handleSelectAsActive }
}

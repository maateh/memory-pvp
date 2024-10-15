import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

export const useSelectAsActiveMutation = () => {
  const router = useRouter()

  const selectAsActive = api.playerProfile.selectAsActive.useMutation({
    onSuccess: async (player) => {
      toast.success('Active player selected!', {
        description: `You've selected ${player.tag} as your active player profile.`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to select player profile as active. Please try again later.')
    }
  })

  const handleSelectAsActive = async (player: ClientPlayer) => {
    if (player.isActive) return

    try {
      await selectAsActive.mutateAsync({ playerId: player.id }) // FIXME: missing id
    } catch (err) {
      logError(err)
    }
  }

  return { selectAsActive, handleSelectAsActive }
}

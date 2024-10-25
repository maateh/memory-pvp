import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { PlayerProfileFormValues } from "@/components/player/player-profile-form"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type UseCreatePlayerMutationParams = {
  onAfterSuccess?: () => void
}

export const useCreatePlayerMutation = ({ onAfterSuccess }: UseCreatePlayerMutationParams) => {
  const router = useRouter()

  const createPlayer = api.player.create.useMutation({
    onSuccess: async ({ tag }) => {
      toast.success('Player created!', {
        description: `You've created a new player profile: ${tag}`
      })

      onAfterSuccess?.()
      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to create player profile. Please try again later.')
    }
  })

  const onSubmit = async (values: PlayerProfileFormValues) => {
    try {
      await createPlayer.mutateAsync(values)
    } catch (err) {
      logError(err)
    }
  }

  return { createPlayer, onSubmit }
}

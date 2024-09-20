import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// types
import { UseFormReturn } from "react-hook-form"
import { PlayerProfileFormValues } from "@/components/form/player-profile-form"

// utils
import { handleApiError } from "@/lib/utils"

export const useCreatePlayerMutation = () => {
  const router = useRouter()

  const createPlayer = api.playerProfile.create.useMutation({
    onSuccess: async ({ tag }) => {
      toast.success('Player created!', {
        description: `You've created a new player profile: ${tag}`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to create player profile. Please try again later.')
    }
  })

  const onSubmit = async (form: UseFormReturn<PlayerProfileFormValues>) => {
    const values = form.getValues()

    await createPlayer.mutateAsync(values)
    form.reset()
  }

  return { createPlayer, onSubmit }
}

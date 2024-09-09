import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// types
import { ZodError } from "zod"
import { UseFormReturn } from "react-hook-form"
import { PlayerProfileFormValues } from "@/components/form/player-profile-form"

export const useCreatePlayerMutation = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const createPlayer = api.playerProfile.create.useMutation({
    onSuccess: async () => {
      toast.success('Player created!', {
        description: `You've created a new player profile: asd`
      })

      router.refresh()
      await utils.playerProfile.invalidate()
    },
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('Player tag is already in use.', {
          description: 'Please try another player tag.'
        })
        return
      }

      if (err instanceof ZodError) {
        toast.error('Validation error', {
          description: 'Please fill in fields correctly.'
        })
        return
      }

      toast.error('Something went wrong.', {
        description: 'Failed to create player profile. Please try again later.'
      })
    }
  })

  const onSubmit = async (values: PlayerProfileFormValues, form: UseFormReturn<PlayerProfileFormValues>) => {
    try {
      await createPlayer.mutateAsync(values)

      form.reset()
    } catch (err) {
      throw new TRPCClientError('Failed to create player profile', { cause: err as Error })
    }
  }

  return { createPlayer, onSubmit }
}

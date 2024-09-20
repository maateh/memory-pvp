import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// types
import type { UseFormReturn } from "react-hook-form"
import type { SetupGameFormValues } from "@/components/form/setup-game-form"

// utils
import { handleApiError } from "@/lib/utils"

export const useStartSessionMutation = () => {
  const router = useRouter()

  const startSession = api.game.create.useMutation({
    onSuccess: ({ type, mode, tableSize }) => {
      router.replace('/game')

      toast.success('Game started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to start game session. Please try again later.')
    }
  })

  const onSubmit = async (form: UseFormReturn<SetupGameFormValues>) => {
    const values = form.getValues()

    // TODO: implement
    if (values.type === 'COMPETITIVE' || values.mode !== 'SINGLE') {
      toast.warning('Work in progress', {
        description: "Sorry, but the configuration contains values that are not implemented yet. Please come back later, or select another game type or mode to play."
      })
      return
    }

    await startSession.mutateAsync(values)
    form.reset()
  }

  return { startSession, onSubmit }
}

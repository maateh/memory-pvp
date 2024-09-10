import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// types
import { ZodError } from "zod"
import { UseFormReturn } from "react-hook-form"
import { StartGameFormValues } from "@/components/form/start-game-form"

export const useStartGameMutation = () => {
  const router = useRouter()

  const startGame = api.game.create.useMutation({
    onSuccess: ({ type, mode, tableSize }) => {
      router.replace('/game')

      toast.success('Game started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError: (err) => {
      let message = 'Something went wrong'
      let description = 'Failed to start game session. Please try again later.'

      if (err.data?.code === 'CONFLICT') {
        message = 'Failed to start game session'
        description = err.message

        // TODO: redirect or open a dialog with options of
        // continue or stop the previous game session
      }

      if (err.data?.code === 'NOT_IMPLEMENTED') {
        message = 'Game mode is not available'
        description = err.message
      }

      if (err instanceof ZodError) {
        message = 'Validation error'
        description = err.message
      }

      toast.error(message, { description })
    }
  })

  const onSubmit = async (values: StartGameFormValues, form: UseFormReturn<StartGameFormValues>) => {
    // TODO: implement
    if (values.type === 'COMPETITIVE' || values.mode !== 'SINGLE') {
      toast.warning('Work in progress', {
        description: "Sorry, but the configuration contains values that are not implemented yet. Please come back later, or select another game type or mode to play."
      })
      return
    }

    try {
      await startGame.mutateAsync(values)

      form.reset()
    } catch (err) {
      throw new TRPCClientError('Failed to register a game session', {
        cause: err as Error
      })
    }
  }

  return { startGame, onSubmit }
}

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { GameStatus } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// hooks
import { useOfflineSessionHandler } from "@/hooks/use-offline-session-handler"

export const useFinishSessionMutation = () => {
  const router = useRouter()

  const { finishOfflineSession } = useOfflineSessionHandler()

  const finishSession = api.game.updateStatus.useMutation({
    onSuccess: ({ status }) => {
      toast.success('Your session has ended.', {
        description: `Session status: ${status}`
      })
      
      const route = status === 'ABANDONED'
        ? '/game/setup'
        : '/dashboard'
      router.replace(route)
    },
    onError: () => {
      toast.error('Something went wrong.', {
        description: 'Failed to update session status. Please try again.'
      })
    }
  })

  const handleFinishSession = async (
    status: typeof GameStatus['ABANDONED' | 'FINISHED'],
    { offline = false }: { offline?: boolean } = {}
  ) => {
    if (offline) return finishOfflineSession(status)

    try {
      await finishSession.mutateAsync(status)
    } catch (err) {
      throw new TRPCClientError('Failed to update session status.', { cause: err as Error })
    }
  }

  return { finishSession, handleFinishSession }
}

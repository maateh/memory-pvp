import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { GameStatus } from "@prisma/client"

// trpc
import { api } from "@/trpc/client"

// hooks
import { useOfflineSessionHandler } from "@/hooks/use-offline-session-handler"

// utils
import { handleApiError } from "@/lib/utils"

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
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to update session status. Please try again.')
    }
  })

  const handleFinishSession = async (
    status: typeof GameStatus['ABANDONED' | 'FINISHED'],
    offline: boolean = false
  ) => {
    if (offline) {
      finishOfflineSession(status)
      return
    }

    await finishSession.mutateAsync(status)
  }

  return { finishSession, handleFinishSession }
}

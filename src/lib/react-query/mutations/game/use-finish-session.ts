import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import type { GameStatus } from "@prisma/client"

// trpc
import { api } from "@/trpc/client"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

// utils
import { handleApiError } from "@/lib/utils"
import { clearSessionFromStorage } from "@/lib/utils/storage"

export const useFinishSessionMutation = () => {
  const router = useRouter()

  const unregisterSession = useSessionStore((state) => state.unregister)

  const finishSession = api.game.updateStatus.useMutation({
    onSuccess: ({ status }) => {
      unregisterSession()
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
      clearSessionFromStorage()
      unregisterSession()
      
      toast.warning('Your offline session has been abandoned.')
      return
    }

    await finishSession.mutateAsync(status)
  }

  return { finishSession, handleFinishSession }
}

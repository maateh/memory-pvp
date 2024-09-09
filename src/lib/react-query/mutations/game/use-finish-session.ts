import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { GameStatus } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

export const useFinishSessionMutation = () => {
  const router = useRouter()

  const finishSession = api.game.updateStatus.useMutation({
    onSuccess: ({ status }) => {
      toast.success('Your last session has ended.', {
        description: `Session status: ${status}`
      })
      
      router.replace('/game/setup')
    },
    onError: () => {
      toast.error('Something went wrong.', {
        description: 'Failed to update session status. Please try again.'
      })
    }
  })

  const handleFinishSession = async (status: typeof GameStatus['ABANDONED' | 'FINISHED']) => {
    try {
      await finishSession.mutateAsync(status)
    } catch (err) {
      throw new TRPCClientError('Failed to update session status.', { cause: err as Error })
    }
  }

  return { finishSession, handleFinishSession }
}

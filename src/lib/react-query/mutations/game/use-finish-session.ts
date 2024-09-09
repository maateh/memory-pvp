import { redirect, useRouter } from "next/navigation"

import { toast } from "sonner"

// clerk
import { useClerk } from "@clerk/nextjs"

// prisma
import { GameStatus } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

export const useFinishSessionMutation = () => {
  const router = useRouter()
  const { user: clerkUser } = useClerk()

  const unregisterClientSession = useGameStore((state) => state.unregister)

  const finishSession = api.game.updateStatus.useMutation({
    onSuccess: ({ status }) => {
      toast.success('Your session has ended.', {
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

  const handleFinishSession = (status: typeof GameStatus['ABANDONED' | 'FINISHED']) => {
    if (!clerkUser) {
      unregisterClientSession()
      
      toast.success('Your session has ended.', {
        description: `Session status: ${status}`
      })
      
      redirect('/game/setup')
    }

    try {
      finishSession.mutate(status)
    } catch (err) {
      throw new TRPCClientError('Failed to update session status.', { cause: err as Error })
    }
  }

  return { finishSession, handleFinishSession }
}

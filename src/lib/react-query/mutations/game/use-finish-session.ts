import { useRouter } from "next/navigation"

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
  const { user: clerkUser, redirectToSignIn } = useClerk()

  const unregisterClientSession = useGameStore((state) => state.unregister)

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

  const handleFinishSession = async (status: typeof GameStatus['ABANDONED' | 'FINISHED']) => {
    if (!clerkUser) {      
      toast.success('Your session has ended.', {
        description: `Session status: ${status}`
      })
      
      if (status === 'ABANDONED') {
        unregisterClientSession()
        router.replace('/game/setup')
        return
      }

      // TODO: after sign in, submit the offline session (?)
      return redirectToSignIn()
    }

    try {
      await finishSession.mutateAsync(status)
    } catch (err) {
      throw new TRPCClientError('Failed to update session status.', { cause: err as Error })
    }
  }

  return { finishSession, handleFinishSession }
}

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// types
import { useGameStore } from "@/hooks/use-game-store"

export const useSaveOfflineSessionMutation = () => {
  const router = useRouter()

  const clientSession = useGameStore((state) => state.get)()
  const unregisterClientSession = useGameStore((state) => state.unregister)

  useEffect(() => {
    if (!clientSession) {
      router.replace('/dashboard')
    }
  }, [router, clientSession])

  const saveOfflineSession = api.game.saveOffline.useMutation({
    onSuccess: () => {
      unregisterClientSession()
      toast.success('Your offline session has been saved.')
      router.replace('/dashboard')
    },
    onError: (err) => {
      let message = 'Something went wrong.'
      let description = "Sorry, but we couldn't save your offline game session."

      if (err.data?.code === 'NOT_FOUND') {
        message = 'Active player profile not found.'
        description = "Please select a player profile first."
      }

      toast.error(message, { description })
    }
  })
  
  const handleSaveOfflineSession = async (playerTag: string) => {
    if (!clientSession) {
      router.replace('/dashboard')
      return
    }

    if (!playerTag.length) {
      toast.warning("Please select a player profile first.")
      return
    }

    try {
      await saveOfflineSession.mutateAsync({ playerTag, ...clientSession })
    } catch (err) {
      throw new TRPCClientError('Failed to save offline session.', { cause: err as Error })
    }
  }

  return { saveOfflineSession, handleSaveOfflineSession }
}

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError } from "@/lib/utils"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

export const useSaveOfflineSessionMutation = () => {
  const router = useRouter()

  const clientSession = useGameStore((state) => state.session)
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
      handleApiError(err.shape?.cause, "Sorry, but we couldn't save your offline game session.")
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

    await saveOfflineSession.mutateAsync({ playerTag, ...clientSession })
  }

  return { saveOfflineSession, handleSaveOfflineSession }
}

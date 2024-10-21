import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// helpers
import { validateCardMatches } from "@/lib/helpers/session"

// utils
import { logError, handleApiError } from "@/lib/utils"
import { clearSessionFromStorage, getSessionFromStorage } from "@/lib/utils/storage"

export const useSaveOfflineSessionMutation = () => {
  const router = useRouter()

  const saveOfflineSession = api.session.saveOffline.useMutation({
    onSuccess: () => {
      clearSessionFromStorage()
      toast.success('Your offline session has been saved.')
      router.replace('/dashboard')
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, "Sorry, but we couldn't save your offline game session.")
    }
  })
  
  const handleSaveOfflineSession = async (playerTag: string) => {
    const offlineSession = getSessionFromStorage()

    if (!offlineSession) {
      router.replace('/dashboard')
      return
    }

    if (!playerTag.length) {
      toast.warning("Please select a player profile first.")
      return
    }

    const isOver = offlineSession.cards.every((card) => !!card.matchedBy)
    if (!isOver) {
      toast.warning("Offline session cannot be saved.", {
        description: "It looks like you haven't completely finished your offline session yet. Please, finish it first or you can start a new game anytime if you want."
      })
      return
    }

    try {
      await saveOfflineSession.mutateAsync({
        ...offlineSession,
        playerTag,
        cards: validateCardMatches(offlineSession.cards)
      })
    } catch (err) {
      logError(err)
    }
  }

  return { saveOfflineSession, handleSaveOfflineSession }
}
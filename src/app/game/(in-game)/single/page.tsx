"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// helpers
import { validateCardMatches } from "@/lib/helpers/session"

// utils
import { handleApiError, logError } from "@/lib/utils"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/session/ingame"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useSessionStore } from "@/hooks/store/use-session-store"

const InGameSinglePage = () => {
  const router = useRouter()

  const storeSession = api.session.store.useMutation({
    onMutate: () => {
      useSessionStore.setState({ syncState: "PENDING" })
    },
    onSuccess: () => {
      useSessionStore.setState({ syncState: "SYNCHRONIZED" })
    },
    onError: (err) => {
      if (err.shape?.cause.key === 'SESSION_NOT_FOUND' && finishSession.isPending) {
        return
      }

      useSessionStore.setState({ syncState: "OUT_OF_SYNC" })
      handleApiError(err.shape?.cause, 'Failed to store game session.')
    }
  })
  
  const finishSession = api.session.finish.useMutation({
    onSuccess: ({ slug }) => {
      router.replace(`/game/summary/${slug}`)

      toast.success('You finished your game session!', {
        description: 'Session data has been successfully saved.'
      })
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to save game session.')
    }
  })

  const { clientSession, handleCardFlip } = useGameHandler({
    onHeartbeat: async () => {
      try {
        await storeSession.mutateAsync(clientSession)
      } catch (err) {
        logError(err)
      }
    },
    onBeforeUnload: async () => {
      const payload = JSON.stringify(clientSession)
      navigator.sendBeacon('/api/session/closed', payload)
    },
    onFinish: async () => {
      try {
        await finishSession.mutateAsync({
          ...clientSession,
          cards: validateCardMatches(clientSession.cards)
        })
      } catch (err) {
        logError(err)
      }
    }
  })

  return (
    <>
      <SessionHeader session={clientSession} />

      <MemoryTable
        session={clientSession}
        handleCardFlip={handleCardFlip}
      />

      <SessionFooter session={clientSession} />
    </>
  )
}

export default InGameSinglePage

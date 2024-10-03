"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError, logError } from "@/lib/utils"

// components
import { SessionHeader } from "@/components/session/header"
import { MemoryTable } from "@/components/session/game"
import { SessionFooter } from "@/components/session/footer"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useSessionStore } from "@/hooks/store/use-session-store"

const GamePlayPage = () => {
  const router = useRouter()

  const storeSession = api.session.store.useMutation({
    onMutate: () => {
      useSessionStore.setState({ syncState: "PENDING" })
    },
    onSuccess: () => {
      useSessionStore.setState({ syncState: "SYNCHRONIZED" })
    },
    onError: (err) => {
      useSessionStore.setState({ syncState: "OUT_OF_SYNC" })
      handleApiError(err.shape?.cause, 'Failed to store game session.')
    }
  })
  
  const saveSession = api.session.save.useMutation({
    onSuccess: ({ sessionId }) => {
      router.replace(`/game/summary/${sessionId}`)

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
        await saveSession.mutateAsync({
          ...clientSession,
          status: 'FINISHED'
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

export default GamePlayPage

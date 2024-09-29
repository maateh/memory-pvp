"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError, logError } from "@/lib/utils"

// components
import { SessionFooter, SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useSessionStore } from "@/hooks/store/use-session-store"

const GamePlayPage = () => {
  const router = useRouter()

  const storeSession = api.session.store.useMutation({
    onSuccess: () => {
      console.log('Success! (session stored)')

      // TODO: A marker inside the SessionHeader would be useful
      // to indicate the session is synchronized or not.
    },
    onError: (err) => {
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
        // TODO: another API endpoint is required which can be
        // triggered by cron jobs to save stored sessions from
        // redis to the mongodb database.

        await storeSession.mutateAsync(clientSession)
        useSessionStore.setState({ shouldStore: false })
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

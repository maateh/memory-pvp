"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// utils
import { saveSessionToStorage } from "@/lib/utils/storage"

// components
import { MemoryTable, SessionHeader, SessionLoader } from "@/components/session/ingame"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"

const InGameOfflinePage = () => {
  const router = useRouter()

  const { clientSession, handleCardFlip } = useGameHandler({
    onIngameUpdate: () => {
      if (!clientSession) return
      saveSessionToStorage(clientSession)
    },
    onFinish: () => {
      if (clientSession) {
        saveSessionToStorage(clientSession)
      }

      toast.success('You finished your offline game session!', {
        description: "You will be redirected to save your results if you want.",
        id: '_' /** Note: prevent re-render by adding a custom id. */
      })

      router.replace('/game/summary/offline')
    }
  })

  if (!clientSession) {
    return <SessionLoader />
  }

  return (
    <>
      <SessionHeader session={clientSession} />

      <MemoryTable
        session={clientSession}
        handleCardFlip={handleCardFlip}
      />
    </>
  )
}

export default InGameOfflinePage

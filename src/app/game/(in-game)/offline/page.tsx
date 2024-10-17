"use client"

import { redirect } from "next/navigation"

import { toast } from "sonner"

// utils
import { saveSessionToStorage } from "@/lib/utils/storage"

// components
import { SessionHeader } from "@/components/session/header"
import { MemoryTable } from "@/components/session/game"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"

const InGameOfflinePage = () => {
  const { clientSession, handleCardFlip } = useGameHandler({
    onIngameUpdate: () => saveSessionToStorage(clientSession),
    onFinish: () => {
      saveSessionToStorage(clientSession)

      toast.success('You finished your offline game session!', {
        description: "Now, you've been redirected to save your results if you want.",
        id: '_' /** Note: prevent re-render by adding a custom id. */
      })

      redirect('/game/offline/save')
    }
  })

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
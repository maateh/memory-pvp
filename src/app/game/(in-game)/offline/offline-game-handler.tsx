"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// utils
import { saveSessionToStorage } from "@/lib/utils/storage"

// components
import { SessionHeader, MemoryTable } from "@/components/session/ingame"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useSessionStore } from "@/components/providers/session-store-provider"

const OfflineGameHandler = () => {
  const router = useRouter()
  const session = useSessionStore((state) => state.session)

  const { handleCardFlip } = useGameHandler({
    onIngameUpdate: () => {
      if (session) saveSessionToStorage(session)
    },
    onFinish: () => {
      if (session) saveSessionToStorage(session)

      toast.success('You finished your offline game session!', {
        description: "You will be redirected to save the results if you want.",
        id: '_' /** Note: prevent re-render by adding a custom id. */
      })

      router.replace('/game/summary/offline')
    }
  })

  return (
    <>
      <SessionHeader session={session} />

      <MemoryTable
        session={session}
        handleCardFlip={handleCardFlip}
      />
    </>
  )
}

export default OfflineGameHandler

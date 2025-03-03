"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// utils
import { saveSessionToStorage } from "@/lib/util/storage"

// components
import { SessionHeader, MemoryTable } from "@/components/gameplay"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useSingleplayerGameHandler } from "@/hooks/handler/use-singleplayer-game-handler"

const OfflineGameHandler = () => {
  const router = useRouter()
  const session = useSessionStore((state) => state.session)

  const { handleCardFlip } = useSingleplayerGameHandler({
    onIngameUpdate() { saveSessionToStorage(session) },

    onFinish() {
      saveSessionToStorage(session)

      router.replace("/game/summary/offline")
      toast.success("You finished your offline game session!", {
        description: "You will be redirected to save the results if you want.",
        id: '_' /** Note: prevent re-render by adding a custom id. */
      })
    }
  })

  return (
    <>
      <SessionHeader />

      <MemoryTable
        handleCardFlip={handleCardFlip}
      />
    </>
  )
}

export default OfflineGameHandler

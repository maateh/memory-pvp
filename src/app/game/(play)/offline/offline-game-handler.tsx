"use client"

import { redirect } from "next/navigation"

import { toast } from "sonner"

// components
import { SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"

const OfflineGameHandler = () => {
  const { clientSession, handleCardFlip } = useGameHandler({
    finishSession: () => {
      toast.success('You finished your offline game session!', {
        description: "Now, you've been redirected to save your results if you want.",
        /**
         * Note: for a reason, this toast would render twice,
         * (because it is used inside a useEffect elsewhere)
         * so it is prevented by adding a custom id.
        */
       id: '_'
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

export default OfflineGameHandler

"use client"

import { toast } from "sonner"

// types
import type { ClientSessionCard } from "@repo/schema/session"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/session/ingame"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useMultiEventStore } from "@/components/provider/multi-event-store-provider"
import { useGameplayHandler } from "@/hooks/handler/use-gameplay-handler"

const MultiGameHandler = () => {
  const session = useSessionStore((state) => state.session)
  const currentPlayer = useSessionStore((state) => state.currentPlayer)
  const sessionCardFlip = useMultiEventStore((state) => state.sessionCardFlip)

  /**
   * Checks if the clicked card is flippable, then calls
   * the socket event that handles this action.
   * 
   * @param {ClientSessionCard} clickedCard - The card clicked by the user.
   * 
   * - Ignores clicks if two cards are already flipped or if the card is matched.
   * - Updates card flip state and checks for a match once two cards are flipped.
   * - If matched, marks both cards as matched. Otherwise, flips them back after a delay.
   */
  const handleCardFlip = (clickedCard: ClientSessionCard) => {
    const flippable = session.currentTurn === currentPlayer.id
      && session.flipped.length < 2
      && session.flipped.every(({ key }) => clickedCard.key !== key)
      && clickedCard.matchedBy === null

    if (flippable) sessionCardFlip(clickedCard)
  }

  useGameplayHandler({
    onFinish() {
      toast.loading("Finishing session...")
    }
  })

  return (
    <>
      <SessionHeader session={session} />

      <MemoryTable
        session={session}
        handleCardFlip={handleCardFlip}
      />

      <SessionFooter session={session} />
    </>
  )
}

export default MultiGameHandler

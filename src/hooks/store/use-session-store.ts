import { create } from "zustand"

// helpers
import { updateSessionStats } from "@/lib/helpers/session"

export type SessionSyncState = "SYNCHRONIZED" | "OUT_OF_SYNC" | "PENDING"

type SessionStore = {
  session: ClientGameSession | null
  syncState: SessionSyncState
  register: (session: ClientGameSession) => void
  unregister: () => void
  updateTimer: (timer: number) => void
  handleFlipUpdate: (clickedCard: ClientSessionCard) => void
  handleMatchUpdate: () => void
  handleUnmatchUpdate: () => void
}

/**
 * Zustand store for managing the game session state.
 * 
 * This store manages the session data and its related operations,
 * such as flipping cards and updating card states.
 */
export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  syncState: "SYNCHRONIZED",
  register: (session) => {
    /**
     * Additional check to prevent a possible issue which
     * may occur if the session store/save happened at
     * the same time when two cards were flipped.
     * 
     * In this case, we have to clear the 'flipped'
     * array because there is no additional event which
     * would solve this problem (which makes unable to
     * flip cards at all).
    */
    if (session.flipped.length === 2) {
      session.flipped = []
    }

    set({ session })
  },
  unregister: () => set({ session: null }),

  updateTimer: (timer) => {
    set(({ session }) => {
      if (session === null) return { session }

      session.stats.timer = timer

      return { session }
    })
  },

  handleFlipUpdate: (clickedCard) => {
    set(({ session }) => {
      if (session === null) return { session }

      const playerTag = session.players.current.tag
      const cards = session.cards.map(
        (card) => card.key === clickedCard.key
          ? { ...card, flippedBy: playerTag }
          : card
      )

      session = {
        ...session,
        cards,
        flipped: [...session.flipped, { id: clickedCard.id, key: clickedCard.key }],
        stats: updateSessionStats(session, 'flip')
      }

      return { session }
    })
  },

  handleMatchUpdate: () => {
    setTimeout(() => {
      set(({ session }) => {
        if (session === null) return { session }

        const playerTag = session.players.current.tag
        const cards = session.cards.map((card) => {
          const prevFlippedCardId = session?.flipped[0].id

          return card.id === prevFlippedCardId
            ? { ...card, flippedBy: null, matchedBy: playerTag }
            : card
        })

        session = {
          ...session,
          cards,
          flipped: [],
          stats: updateSessionStats(session, "match")
        }

        return { session, syncState: 'OUT_OF_SYNC' }
      })
    }, 1000)
  },

  handleUnmatchUpdate: () => {
    setTimeout(() => {
      set(({ session }) => {
        if (session === null) return { session }

        const cards = session.cards.map((card) => {
          const isFlipped = session?.flipped.some((fc) => fc.key === card.key)

          return isFlipped
            ? { ...card, flippedBy: null }
            : card
        })

        session = {
          ...session,
          cards,
          flipped: []
        }

        return { session }
      })
    }, 1000)
  }
}))

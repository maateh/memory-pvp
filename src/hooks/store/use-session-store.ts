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
  handleFlipUpdate: (clickedCard: PrismaJson.MemoryCard) => void
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
    set((state) => {
      if (state.session === null) return state

      let session = state.session
      const playerTag = session.players.current.tag

      const cards = session.cards.map(
        (card) => card.id === clickedCard.id
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
      set((state) => {
        if (state.session === null) return state

        let session = state.session
        const playerTag = session.players.current.tag

        const cards = state.session.cards.map((card) => {
          const prevFlippedCardKey = session.flipped[0].key

          return card.key === prevFlippedCardKey
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
      set((state) => {
        if (state.session === null) return state
        let session = state.session

        const cards = session.cards.map((card) => {
          const isFlipped = session.flipped.some((fc) => fc.id === card.id)

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

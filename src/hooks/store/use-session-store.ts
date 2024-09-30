import { create } from "zustand"

type SessionStore = {
  session: ClientGameSession | null
  shouldStore: boolean
  register: (session: ClientGameSession) => void
  unregister: () => void
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
  shouldStore: false,
  register: (session) => {
    /**
     * Additional check to prevent a possible issue which
     * may occur if the session store/save happened at
     * the same time when two cards were flipped.
     * 
     * In this case, we have to clear the 'flippedCards'
     * array because there is no additional event which
     * would solve this problem (which makes unable to
     * flip cards at all).
    */
    if (session.flippedCards.length === 2) {
      session.flippedCards = []
    }

    set({ session })
  },
  unregister: () => set({ session: null }),

  handleFlipUpdate: (clickedCard) => {
    set((state) => {
      if (state.session === null) return state
      let session = state.session

      const cards = session.cards.map(
        (card) => card.id === clickedCard.id
          ? { ...card, isFlipped: true }
          : card
      )

      session = {
        ...session,
        cards,
        flippedCards: [...session.flippedCards, clickedCard],
        result: {
          flips: (state.session.result?.flips || 0) + 1,
        }
      }

      return { session }
    })
  },

  handleMatchUpdate: () => {
    setTimeout(() => {
      set((state) => {
        if (state.session === null) return state
        let session = state.session

        const cards = state.session.cards.map(
          (card) => card.key === session.flippedCards[0].key
            ? { ...card, isMatched: true }
            : card
        )

        session = {
          ...session,
          cards,
          flippedCards: []
        }

        return { session, shouldStore: true }
      })
    }, 1000)
  },

  handleUnmatchUpdate: () => {
    setTimeout(() => {
      set((state) => {
        if (state.session === null) return state
        let session = state.session

        const cards = session.cards.map(
          (card) => session.flippedCards.some(fc => fc.id === card.id)
            ? { ...card, isFlipped: false }
            : card
        )

        session = {
          ...session,
          cards,
          flippedCards: []
        }

        return { session }
      })
    }, 1000)
  }
}))

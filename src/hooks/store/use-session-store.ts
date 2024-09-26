import { create } from "zustand"

type SessionStore = {
  session: ClientGameSession | null
  shouldStore: boolean | null
  register: (session: ClientGameSession) => void
  unregister: () => void
  updateFlippedCards: (clickedCard: MemoryCard) => void
  clearFlippedCards: () => void
  updateCards: (cards: MemoryCard[]) => void
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
  register: (session) => set({ session }),
  unregister: () => set({ session: null }),

  updateFlippedCards: (clickedCard) => {
    set((state) => {
      if (state.session === null) return state

      const session = {
        ...state.session,
        flippedCards: [...state.session.flippedCards, clickedCard],
        flips: state.session.flips + 1
      }

      return { session }
    })
  },

  clearFlippedCards: () => {
    set((state) => {
      if (state.session === null) return state

      const session = { ...state.session, flippedCards: [] }

      return { session }
    })
  },

  updateCards: (cards) => {
    set((state) => {
      if (state.session === null) return state

      const session = { ...state.session, cards }
      
      return { session, shouldStore: true }
    })
  }
}))

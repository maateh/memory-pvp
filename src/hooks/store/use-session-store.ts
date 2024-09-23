import { create } from "zustand"

type SessionStore = {
  session: ClientGameSession | null
  register: (session: ClientGameSession) => void
  unregister: () => void
  increaseFlips: () => void
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
  register: (session) => set({ session }),
  unregister: () => set({ session: null }),

  increaseFlips: () => {
    set((state) => {
      if (state.session === null) return state

      const session = {
        ...state.session,
        flips: state.session.flips + 1
      }

      return { session }
    })
  },

  updateCards: (cards) => {
    set((state) => {
      if (state.session === null) return state

      const session = { ...state.session, cards }
      
      return { session }
    })
  }
}))

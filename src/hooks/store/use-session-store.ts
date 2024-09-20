import { create } from "zustand"

export type MemoryCard = { // TODO: temporary. (it'll be moved to a prisma schema type soon)
  id: string
  key: string
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

type SessionStore = {
  session: ClientGameSession | null
  register: (session: ClientGameSession) => void
  unregister: () => void
  increaseFlips: () => void
  updateCards: (cards: MemoryCard[]) => void
}

/** Zustand store hook */
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

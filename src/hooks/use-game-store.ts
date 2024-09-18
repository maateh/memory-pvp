import { create } from "zustand"

// prisma
import type { TableSize } from "@prisma/client"

export type MemoryCard = { // TODO: temporary. (it'll be moved to a prisma schema type soon)
  id: string
  key: string
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

export type UnsignedClientGameSession = {
  tableSize: TableSize
  startedAt: Date
  flips: number
  cards: MemoryCard[]
}

type GameStore = {
  session: UnsignedClientGameSession | null
  register: (session: UnsignedClientGameSession) => void
  unregister: () => void
  increaseFlips: () => void
  updateCards: (cards: MemoryCard[]) => void
}

const STORAGE_KEY = "CLIENT_GAME_SESSION"

/** Local storage utils */
const getSessionFromStorage = (): UnsignedClientGameSession | null => {
  if (typeof window === 'undefined') return null

  const rawSession = localStorage.getItem(STORAGE_KEY)
  if (!rawSession) return null

  return JSON.parse(rawSession)
}

/** Zustand store hook */
export const useGameStore = create<GameStore>((set) => ({
  session: getSessionFromStorage(),

  register: (session) => {
    if (typeof window === 'undefined') return null

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    set({ session })
  },

  unregister: () => {
    if (typeof window === 'undefined') return null
    
    localStorage.removeItem(STORAGE_KEY)
    set({ session: null })
  },

  increaseFlips: () => {
    if (typeof window === 'undefined') return null

    set((state) => {
      if (state.session === null) return state

      const session = {
        ...state.session,
        flips: state.session.flips + 1
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

      return { session }
    })
  },

  updateCards: (cards) => {
    if (typeof window === 'undefined') return null

    set((state) => {
      if (state.session === null) return state

      const session = { ...state.session, cards }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

      return { session }
    })
  }
}))

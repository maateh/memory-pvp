import { create } from "zustand"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

export type MemoryCard = {
  id: string
  key: string
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

type UnsignedGameSessionClient = {
  tableSize: TableSize
  startedAt: Date
  flips: number
  cards: MemoryCard[]
}

export type GameSessionClient = UnsignedGameSessionClient & {
  type: GameType
  mode: GameMode
  status: GameStatus
}

type GameStore = {
  session: GameSessionClient | null
  register: (session: UnsignedGameSessionClient) => void
  unregister: () => void
  updateCards: (cards: MemoryCard[]) => void
}

const OFFLINE_SESSION: Omit<GameSessionClient, keyof UnsignedGameSessionClient> = {
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
}

const getSessionFromStorage = (): GameSessionClient | null => {
  if (typeof window === 'undefined') return null

  const rawSession = localStorage.getItem('CLIENT_GAME_SESSION')
  if (!rawSession) return null

  const session = JSON.parse(rawSession)
  return {
    ...session,
    ...OFFLINE_SESSION
  }  
}

export const useGameStore = create<GameStore>((set) => ({
  session: getSessionFromStorage(),

  register: (session) => {
    if (typeof window === 'undefined') return null

    localStorage.setItem('CLIENT_GAME_SESSION', JSON.stringify(session))
    set({
      session: {
        ...session,
        ...OFFLINE_SESSION
      }
    })
  },

  unregister: () => {
    if (typeof window === 'undefined') return null
    
    localStorage.removeItem('CLIENT_GAME_SESSION')
    set({ session: null })
  },

  updateCards: (cards) => 
    set((state) => {
      if (state.session === null) return state
      return { session: { ...state.session, cards } }
    })
}))

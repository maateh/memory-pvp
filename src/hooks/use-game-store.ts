import { create } from "zustand"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

type UnsignedGameSessionClient = {
  tableSize: TableSize
  startedAt: Date
}

export type GameSessionClient = UnsignedGameSessionClient & {
  type: GameType
  mode: GameMode
  status: GameStatus
}

type GameStore = {
  session: GameSessionClient | null
  get: () => GameSessionClient | null
  register: (session: UnsignedGameSessionClient) => void
  unregister: () => void
}

const OFFLINE_SESSION: Omit<GameSessionClient, keyof UnsignedGameSessionClient> = {
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
}

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  get: () => {
    if (typeof window === 'undefined') return null

    const rawSession = localStorage.getItem('CLIENT_GAME_SESSION')
    if (!rawSession) return null

    const session = JSON.parse(rawSession)
    return {
      ...session,
      ...OFFLINE_SESSION
    }
  },
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
  }
}))

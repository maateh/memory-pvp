import { create } from "zustand"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

export type UnsignedGameSessionClient = {
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

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  get: () => {
    const rawSession = localStorage.getItem('CLIENT_GAME_SESSION')
    if (!rawSession) return null

    const session = JSON.parse(rawSession)
    return {
      type: 'CASUAL',
      mode: 'SINGLE',
      status: 'RUNNING',
      ...session
    }
  },
  register: (session) => {
    localStorage.setItem('CLIENT_GAME_SESSION', JSON.stringify(session))
    set({
      session: {
        type: 'CASUAL',
        mode: 'SINGLE',
        status: 'RUNNING',
        ...session
      }
    })
  },
  unregister: () => {
    localStorage.removeItem('CLIENT_GAME_SESSION')
    set({ session: null })
  }
}))

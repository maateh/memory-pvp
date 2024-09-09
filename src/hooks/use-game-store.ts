import { create } from "zustand"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

export type GameSessionClient = {
  type: GameType
  mode: GameMode
  tableSize: TableSize
  status: GameStatus
  startedAt: Date
}

type GameStore = {
  session: GameSessionClient | null
  register: (session: GameSessionClient) => void
  unregister: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  register: (session) => set({ session }),
  unregister: () => set({ session: null })
}))

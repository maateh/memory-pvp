import { create } from "zustand"

// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

export type UnsignedGameSessionClient = {
  type: GameType
  mode: GameMode
  tableSize: TableSize
  startedAt: Date
}

type GameStore = {
  session: UnsignedGameSessionClient | null
  register: (session: UnsignedGameSessionClient) => void
  unregister: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  register: (session) => set({ session }),
  unregister: () => set({ session: null })
}))

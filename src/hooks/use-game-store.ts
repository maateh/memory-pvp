import { create } from "zustand";

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

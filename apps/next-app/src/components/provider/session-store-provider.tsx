"use client"

import { createContext, useContext, useState } from "react"
import { useStore } from "zustand"

// types
import type { StoreApi } from "zustand"
import type { ClientPlayer } from "@repo/schema/player"
import type { ClientSession } from "@repo/schema/session"
import type { SessionStore } from "@/lib/store/session-store"

// store
import { sessionStore } from "@/lib/store/session-store"

const SessionStoreContext = createContext<StoreApi<SessionStore> | null>(null)

type SessionStoreProviderProps = {
  currentPlayer: ClientPlayer
  initialSession: ClientSession
  children: React.ReactNode
}

const SessionStoreProvider = ({ initialSession, currentPlayer, children }: SessionStoreProviderProps) => {
  const [store] = useState(
    sessionStore({
      initialSession,
      currentPlayer
    })
  )

  return (
    <SessionStoreContext.Provider value={store}>
      {children}
    </SessionStoreContext.Provider>
  )
}

function useSessionStore<T>(selector: (state: SessionStore) => T) {
  const context = useContext(SessionStoreContext)

  if (!context) {
    throw new Error("Session store must be used within its provider.")
  }

  return useStore(context, selector)
}

export default SessionStoreProvider
export { useSessionStore }

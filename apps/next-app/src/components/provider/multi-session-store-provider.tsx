"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "zustand"

// types
import type { StoreApi } from "zustand"
import type { ClientPlayer } from "@repo/schema/player"
import type { ClientGameSession } from "@repo/schema/session"
import type { MultiSessionStore } from "@/lib/store/multi-session-store"

// store
import { multiSessionStore } from "@/lib/store/multi-session-store"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

const MultiSessionStoreContext = createContext<StoreApi<MultiSessionStore> | null>(null)

type MultiSessionStoreProviderProps = {
  initialSession: ClientGameSession
  currentPlayer: ClientPlayer
  children: React.ReactNode
}

const MultiSessionStoreProvider = ({ initialSession, currentPlayer, children }: MultiSessionStoreProviderProps) => {
  const { socket } = useSocketService()

  const [store] = useState(
    multiSessionStore({
      initialSession,
      currentPlayer,
      socket
    })
  )

  useEffect(() => {
    const {

    } = store.getState()

    // TODO: initialize event listeners

    return () => {
      
    }
  }, [socket, store])

  return (
    <MultiSessionStoreContext.Provider value={store}>
      {children}
    </MultiSessionStoreContext.Provider>
  )
}

function useMultiSessionStore<T>(selector: (state: MultiSessionStore) => T) {
  const context = useContext(MultiSessionStoreContext)

  if (!context) {
    throw new Error('Multi session store must be used within its provider.')
  }

  return useStore(context, selector)
}

export default MultiSessionStoreProvider
export { useMultiSessionStore }

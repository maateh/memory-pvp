"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "zustand"

// types
import type { StoreApi } from "zustand"
import type { MultiEventStore } from "@/lib/store/multi-event-store"

// store
import { multiEventStore } from "@/lib/store/multi-event-store"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useSessionStore } from "@/components/provider/session-store-provider"

const MultiEventStoreContext = createContext<StoreApi<MultiEventStore> | null>(null)

type MultiEventStoreProviderProps = {
  children: React.ReactNode
}

const MultiEventStoreProvider = ({ children }: MultiEventStoreProviderProps) => {
  const { socket } = useSocketService()

  const setStoreState = useSessionStore((state) => state.setState)

  const [store] = useState(
    multiEventStore({
      socket,
      setStoreState
    })
  )

  useEffect(() => {
    const {
      sessionCardFlipped,
      sessionCardMatched,
      sessionCardUnmatched,
      sessionFinished
    } = store.getState()

    socket.on("session:card:flipped", sessionCardFlipped)
    socket.on("session:card:matched", sessionCardMatched)
    socket.on("session:card:unmatched", sessionCardUnmatched)
    socket.on("session:finished", sessionFinished)

    return () => {
      socket.off("session:card:flipped", sessionCardFlipped)
      socket.off("session:card:matched", sessionCardMatched)
      socket.off("session:card:unmatched", sessionCardUnmatched)
      socket.off("session:finished", sessionFinished)
    }
  }, [socket, store])

  return (
    <MultiEventStoreContext.Provider value={store}>
      {children}
    </MultiEventStoreContext.Provider>
  )
}

function useMultiEventStore<T>(selector: (state: MultiEventStore) => T) {
  const context = useContext(MultiEventStoreContext)

  if (!context) {
    throw new Error("Multi event store must be used within its provider.")
  }

  return useStore(context, selector)
}

export default MultiEventStoreProvider
export { useMultiEventStore }

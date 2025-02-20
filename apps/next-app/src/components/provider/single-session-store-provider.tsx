"use client"

import { createContext, useContext, useState } from "react"
import { useStore } from "zustand"

// types
import type { StoreApi } from "zustand"
import type { ClientSession } from "@repo/schema/session"
import type { SingleSessionStore } from "@/lib/store/single-session-store"

// store
import { singleSessionStore } from "@/lib/store/single-session-store"

const SingleSessionStoreContext = createContext<StoreApi<SingleSessionStore> | null>(null)

type SingleSessionStoreProviderProps = {
  initialSession: ClientSession
  children: React.ReactNode
}

const SingleSessionStoreProvider = ({ initialSession, children }: SingleSessionStoreProviderProps) => {
  const [store] = useState(
    singleSessionStore({
      initialSession
    })
  )

  return (
    <SingleSessionStoreContext.Provider value={store}>
      {children}
    </SingleSessionStoreContext.Provider>
  )
}

function useSingleSessionStore<T>(selector: (state: SingleSessionStore) => T) {
  const context = useContext(SingleSessionStoreContext)

  if (!context) {
    throw new Error('Single session store must be used within its provider.')
  }

  return useStore(context, selector)
}

export default SingleSessionStoreProvider
export { useSingleSessionStore }

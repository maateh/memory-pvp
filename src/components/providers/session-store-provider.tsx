"use client"

import { createContext, useContext, useState } from "react"
import { createStore, useStore } from "zustand"

// types
import type { StoreApi } from "zustand"

// helpers
import { updateSessionStats } from "@/lib/helpers/session"

export type SessionSyncState = "SYNCHRONIZED" | "OUT_OF_SYNC" | "PENDING"

type SessionStore = {
  session: ClientGameSession
  syncState: SessionSyncState
  updateSyncState: (syncState: SessionSyncState) => void
  updateTimer: (timer: number) => void
  handleFlipUpdate: (clickedCard: ClientSessionCard) => void
  handleMatchUpdate: () => void
  handleUnmatchUpdate: () => void
}

const SessionStoreContext = createContext<StoreApi<SessionStore> | null>(null)

type SessionStoreProviderProps = {
  session: ClientGameSession
  syncState?: SessionSyncState
  children: React.ReactNode
}

const SessionStoreProvider = ({ session, syncState = 'SYNCHRONIZED', ...props }: SessionStoreProviderProps) => {
  const [store] = useState(() => {
    return createStore<SessionStore>((set) => ({
      session, syncState,

      updateSyncState(syncState) {
        set({ syncState })
      },
      
      updateTimer(timer) {
        set(({ session }) => {
          if (session === null) return { session }
    
          session.stats.timer = timer
    
          return { session }
        })
      },
    
      handleFlipUpdate(clickedCard) {
        set(({ session }) => {
          if (session === null) return { session }
    
          const playerId = session.players.current.id
          const cards = session.cards.map(
            (card) => card.key === clickedCard.key
              ? { ...card, flippedBy: playerId }
              : card
          )
    
          session = {
            ...session,
            cards,
            flipped: [...session.flipped, { id: clickedCard.id, key: clickedCard.key }],
            stats: updateSessionStats(session, 'flip')
          }
    
          return { session }
        })
      },
    
      handleMatchUpdate() {
        setTimeout(() => {
          set(({ session }) => {
            if (session === null) return { session }
    
            const playerId = session.players.current.id
            const cards = session.cards.map((card) => {
              const prevFlippedCardId = session?.flipped[0].id
    
              return card.id === prevFlippedCardId
                ? { ...card, flippedBy: null, matchedBy: playerId }
                : card
            })
    
            session = {
              ...session,
              cards,
              flipped: [],
              stats: updateSessionStats(session, "match")
            }
    
            return { session, syncState: 'OUT_OF_SYNC' }
          })
        }, 1000)
      },
    
      handleUnmatchUpdate() {
        setTimeout(() => {
          set(({ session }) => {
            if (session === null) return { session }
    
            const cards = session.cards.map((card) => {
              const isFlipped = session?.flipped.some((fc) => fc.key === card.key)
    
              return isFlipped
                ? { ...card, flippedBy: null }
                : card
            })
    
            session = {
              ...session,
              cards,
              flipped: []
            }
    
            return { session }
          })
        }, 1000)
      }
    }))
  })

  return <SessionStoreContext.Provider value={store} {...props} />
}

function useSessionStore<T>(selector: (state: SessionStore) => T) {
  const context = useContext(SessionStoreContext)

  if (!context) {
    throw new Error('Session store must be used within its provider.')
  }

  return useStore(context, selector)
}

export default SessionStoreProvider
export { useSessionStore }

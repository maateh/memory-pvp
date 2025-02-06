import { createStore } from "zustand"

// types
import type { ClientGameSession, ClientSessionCard } from "@/lib/schema/session-schema"

export type SessionSyncState = "SYNCHRONIZED" | "OUT_OF_SYNC" | "PENDING"

type SingleSessionState = {
  session: ClientGameSession
  syncState: SessionSyncState
}

type SingleSessionAction = {
  updateSyncState: (syncState: SessionSyncState) => void
  updateTimer: (timer: number) => void
  handleFlipUpdate: (clickedCard: ClientSessionCard) => void
  handleMatchUpdate: () => void
  handleUnmatchUpdate: () => void
}

export type SingleSessionStore = SingleSessionState & SingleSessionAction

type SingleSessionStoreProps = {
  session: ClientGameSession
  syncState?: SessionSyncState
}

export const singleSessionStore = ({
  session,
  syncState = "SYNCHRONIZED"
}: SingleSessionStoreProps) => () => createStore<SingleSessionStore>((set) => ({
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

      /*
       * Note: updates `flips` value of the player inside the session stats.
       * Then, updates the session object itself.
       */
      const prevFlips = session.stats.flips[playerId]
      session.stats.flips[playerId] = session.flipped.length === 1
          ? prevFlips + 1 : prevFlips

      session = {
        ...session,
        flipped: [...session.flipped, { id: clickedCard.id, key: clickedCard.key }]
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
            ? { ...card, matchedBy: playerId }
            : card
        })

        /*
         * Note: updates `matches` value of the player inside the session stats.
         * Then, updates the session object itself.
         */
        ++session.stats.matches[playerId]
        session = {
          ...session,
          cards,
          flipped: []
        }

        return { session, syncState: 'OUT_OF_SYNC' }
      })
    }, 1000)
  },

  handleUnmatchUpdate() {
    setTimeout(() => {
      set(({ session }) => {
        if (session === null) return { session }

        session = {
          ...session,
          flipped: []
        }

        return { session }
      })
    }, 1000)
  }
}))

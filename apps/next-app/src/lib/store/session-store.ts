import { createStore } from "zustand"

// types
import type { ClientPlayer } from "@repo/schema/player"
import type { ClientSession, ClientSessionCard } from "@repo/schema/session"

// TODO: add `syncStatus`
type SessionState = {
  session: ClientSession
  currentPlayer: ClientPlayer
  hasCurrentTurn: boolean
}

type SessionAction = {
  setState: (
    partial: SessionStore | Partial<SessionStore> | ((state: SessionStore) => SessionStore | Partial<SessionStore>),
    replace?: boolean | undefined
  ) => void
  sessionCardFlip: (clickedCard: ClientSessionCard) => void
  sessionCardMatch: () => void
  sessionCardUnmatch: () => void
}

export type SessionStore = SessionState & SessionAction

type SessionStoreProps = {
  initialSession: ClientSession
  currentPlayer: ClientPlayer
  hasCurrentTurn: boolean
}

export const sessionStore = ({
  initialSession,
  currentPlayer,
  hasCurrentTurn
}: SessionStoreProps) => () => createStore<SessionStore>((set) => ({
  /* States */
  session: initialSession,
  currentPlayer,
  hasCurrentTurn,

  /* Actions */
  setState: set,

  sessionCardFlip(clickedCard) {
    set(({ session: { ...session } }) => {
      session.flipped = [...session.flipped, {
        id: clickedCard.id,
        key: clickedCard.key
      }]

      if (session.flipped.length === 1) {
        ++session.stats.flips[currentPlayer.id]  
      }

      return { session }
    })
  },

  sessionCardMatch() {
    set(({ session: { ...session } }) => {
      session.cards = session.cards.map(
        (card) => card.id === session.flipped[0].id
          ? { ...card, matchedBy: currentPlayer.id }
          : card
      )

      session.flipped = []
      ++session.stats.matches[currentPlayer.id]

      return { session }
    })
  },

  sessionCardUnmatch() {
    set(({ session: { ...session } }) => {
      session.flipped = []
      return { session }
    })
  }
}))

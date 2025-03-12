import { createStore } from "zustand"

// types
import type { ClientPlayer } from "@repo/schema/player"
import type { ClientSessionVariants, ClientSessionCard } from "@repo/schema/session"
import type { SyncStatus } from "@/components/shared/sync-indicator"

type SessionState = {
  session: ClientSessionVariants
  currentPlayer: ClientPlayer
  syncStatus: SyncStatus
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
  initialSession: ClientSessionVariants
  currentPlayer: ClientPlayer
}

export const sessionStore = ({
  initialSession,
  currentPlayer
}: SessionStoreProps) => () => createStore<SessionStore>((set) => ({
  /* States */
  session: initialSession,
  currentPlayer,
  syncStatus: "synchronized",

  /* Actions */
  setState: set,

  sessionCardFlip(clickedCard) {
    set(({ session: { ...session } }) => {
      session.flipped = [...session.flipped, {
        id: clickedCard.id,
        key: clickedCard.key
      }]

      ++session.stats.flips[currentPlayer.id]

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

      return { session, syncStatus: "out_of_sync" }
    })
  },

  sessionCardUnmatch() {
    set(({ session: { ...session } }) => {
      session.flipped = []
      return { session }
    })
  }
}))

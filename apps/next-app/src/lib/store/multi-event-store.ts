import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { Socket } from "socket.io-client"
import type { SocketResponse } from "@repo/server/socket-types"
import type { ClientSessionCard, MultiClientSession } from "@repo/schema/session"
import type { SessionStore } from "./session-store"

// utils
import { ServerError } from "@repo/server/error"
import { handleServerError, logError } from "@/lib/util/error"

type MultiEventAction = {
  sessionCardFlip: (clickedCard: ClientSessionCard) => Promise<void>
}

type MultiEventListener = {
  sessionCardFlipped: (response: SocketResponse<MultiClientSession>) => void
  sessionCardMatched: (response: SocketResponse<MultiClientSession>) => void
  sessionCardUnmatched: (response: SocketResponse<MultiClientSession>) => void
  sessionFinished: (response: SocketResponse) => void
}

export type MultiEventStore = MultiEventAction & MultiEventListener

type MultiEventStoreProps = {
  socket: Socket,
  setStoreState: (
    partial: SessionStore | Partial<SessionStore> | ((state: SessionStore) => SessionStore | Partial<SessionStore>),
    replace?: boolean | undefined
  ) => void
}

export const multiEventStore = ({
  socket,
  setStoreState
}: MultiEventStoreProps) => () => createStore<MultiEventStore>(() => ({
  /* Actions */
  async sessionCardFlip(clickedCard) {
    try {
      // TODO: add `SessionCardFlipValidation` schema

      const { error }: SocketResponse = await socket.emitWithAck("session:card:flip", {
        clickedCard
      } satisfies { clickedCard: ClientSessionCard })

      if (error) {
        throw ServerError.parser(error)
      }
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    }
  },

  /* Listeners */
  sessionCardFlipped({ data: session, error }) {
    if (error || !session) return handleServerError(error)
    
    // TODO: returned data type is not final here
    setStoreState({ session })
  },

  sessionCardMatched({ data: session, error }) {
    if (error || !session) return handleServerError(error)
    
    // TODO: returned data type is not final here
    setStoreState({ session })
  },

  sessionCardUnmatched({ data: session, error }) {
    if (error || !session) return handleServerError(error)
    
    // TODO: returned data type is not final here
    setStoreState({ session })
  },

  sessionFinished({ message, description, error }) {
    if (error) return handleServerError(error)

    // TODO: handle session finished
  },
}))

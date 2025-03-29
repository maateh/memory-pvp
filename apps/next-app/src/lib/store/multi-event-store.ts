import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { Socket } from "socket.io-client"
import type { SocketResponse } from "@repo/server/socket-types"
import type { ClientSessionCard, SessionStateUpdater } from "@repo/schema/session"
import type { SessionCardFlipValidation } from "@repo/schema/room-validation"
import type { SessionStore } from "./session-store"

// utils
import { ServerError } from "@repo/server/error"
import { handleServerError, logError } from "@/lib/util/error"

type MultiEventAction = {
  sessionCardFlip: (clickedCard: ClientSessionCard) => Promise<void>
}

type MultiEventListener = {
  sessionCardFlipped: (response: SocketResponse<Partial<SessionStateUpdater>>) => void
  sessionCardMatched: (response: SocketResponse<Partial<SessionStateUpdater>>) => void
  sessionCardUnmatched: (response: SocketResponse<Partial<SessionStateUpdater>>) => void
  sessionFinished: (response: SocketResponse<string>) => void
}

export type MultiEventStore = MultiEventAction & MultiEventListener

type MultiEventStoreProps = {
  socket: Socket,
  router: AppRouterInstance
  optimisticCardFlip: (clickedCard: ClientSessionCard) => void
  setStoreState: (
    partial: SessionStore | Partial<SessionStore> | ((state: SessionStore) => SessionStore | Partial<SessionStore>),
    replace?: false | undefined
  ) => void
}

export const multiEventStore = ({
  socket,
  router,
  optimisticCardFlip,
  setStoreState
}: MultiEventStoreProps) => () => createStore<MultiEventStore>(() => ({
  /* Actions */
  async sessionCardFlip(clickedCard) {
    setStoreState({ syncStatus: "synchronizing" })
    optimisticCardFlip(clickedCard)

    try {
      const { error }: SocketResponse = await socket.emitWithAck("session:card:flip", {
        clickedCard
      } satisfies SessionCardFlipValidation)

      if (error) {
        throw ServerError.parser(error)
      }
    } catch (err) {
      if (!socket.active) return

      handleServerError(err as ServerError)
      logError(err)
    }
  },

  /* Listeners */
  sessionCardFlipped({ data: updater, error }) {
    if (error || !updater) return handleServerError(error)

    setStoreState(({ session }) => ({
      syncStatus: "synchronized",
      session: { ...session, ...updater }
    }))
  },

  sessionCardMatched({ data: updater, error }) {
    if (error || !updater) return handleServerError(error)

    setStoreState(({ session }) => ({
      syncStatus: "synchronized",
      session: { ...session, ...updater }
    }))
  },

  sessionCardUnmatched({ data: updater, error }) {
    if (error || !updater) return handleServerError(error)

    setStoreState({ syncStatus: "synchronized" })
    setTimeout(() => {
      setStoreState(({ session }) => ({
        session: { ...session, ...updater }
      }))
    }, 800)
  },

  sessionFinished({ data: roomSlug, message, description, error }) {
    if (error) return handleServerError(error)

    socket.emit("connection:clear")
    toast.dismiss("session:finished")
    toast.success(message, { description })

    router.replace(`/game/summary/${roomSlug}`)
  },
}))

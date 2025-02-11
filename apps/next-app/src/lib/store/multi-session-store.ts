import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { Socket } from "socket.io-client"
import type { SocketResponse } from "@repo/server/socket-types"
import type { ClientGameSession } from "@repo/schema/session"

// utils
import { ServerError } from "@repo/server/error"
import { handleServerError, logError } from "@/lib/util/error"

type MultiSessionState = {
  session: ClientGameSession
}

type MultiSessionAction = {
  // TODO: add actions
}

type MultiSessionListener = {
  // TODO: add listeners
}

export type MultiSessionStore = MultiSessionState & MultiSessionAction & MultiSessionListener

type MultiSessionStoreProps = {
  initialSession: ClientGameSession
  socket: Socket
}

export const multiSessionStore = ({
  initialSession,
  socket
}: MultiSessionStoreProps) => () => createStore<MultiSessionStore>((set) => ({
  session: initialSession,

  /* Actions */

  /* Listeners */
}))

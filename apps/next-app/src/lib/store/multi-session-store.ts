import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { Socket } from "socket.io-client"
import type { SocketResponse } from "@repo/types/socket-api"
import type { ClientGameSession } from "@repo/schema/session"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { ApiError } from "@/server/_error"
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

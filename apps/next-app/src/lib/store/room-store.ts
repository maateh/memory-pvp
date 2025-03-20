import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { Socket } from "socket.io-client"
import type { ToastT } from "sonner"
import type { ExtendedSocketError, SocketResponse } from "@repo/server/socket-types"
import type { RoomPlayer } from "@repo/schema/player"
import type { RoomVariants, JoinedRoom, WaitingRoom, RunningRoom } from "@repo/schema/room"

// actions
import {
  createMultiplayerSession,
  forceCloseMultiplayerSession,
  leaveOrCloseRoom
} from "@/server/action/session/multiplayer-action"

// helpers
import { currentPlayerKey } from "@repo/helper/player"

// utils
import { ServerError } from "@repo/server/error"
import { handleServerError, logError } from "@/lib/util/error"

type RoomState = {
  room: RoomVariants
  currentRoomPlayer: RoomPlayer
}

type RoomAction = {
  roomLeave: () => Promise<void>
  roomClose: () => Promise<void>
  roomReady: () => Promise<void>
  roomKick: () => Promise<void>
  sessionClose: () => Promise<void>
}

type RoomListener = {
  roomConnected: (response: SocketResponse<RoomVariants>) => void
  roomDisconnected: (response: SocketResponse<JoinedRoom | RunningRoom>) => void
  roomLeft: (response: SocketResponse<WaitingRoom>) => void
  roomClosed: (response: SocketResponse) => void
  roomKicked: (response: SocketResponse) => void
  roomReadied: (response: SocketResponse<JoinedRoom | RunningRoom>) => Promise<void>
  sessionStartingFailed: (response: SocketResponse) => void
  sessionStarted: (response: SocketResponse<RunningRoom>) => void
  connectError: (error: ExtendedSocketError<ServerError>) => void
  disconnect: (reason: Socket.DisconnectReason) => void
}

export type RoomStore = RoomState & RoomAction & RoomListener

type RoomStoreProps = {
  initialRoom: RoomVariants
  currentPlayerId: string
  socket: Socket
  router: AppRouterInstance
}

export const roomStore = ({
  initialRoom,
  currentPlayerId,
  socket,
  router
}: RoomStoreProps) => () => createStore<RoomStore>((set) => ({
  room: initialRoom,
  currentRoomPlayer: initialRoom.status === "waiting" || initialRoom.owner.id === currentPlayerId
    ? initialRoom.owner
    : initialRoom.guest,

  /* Actions */
  async roomLeave() {
    toast.loading("Leaving room...", { id: "room:leave" })

    try {
      const {
        message,
        description,
        error
      }: SocketResponse = await socket.emitWithAck("room:leave", {})

      if (error) {
        throw ServerError.parser(error)
      }

      router.replace("/dashboard/rooms")
      toast.success(message, { description })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("room:leave") }
  },

  async roomClose() {
    toast.loading("Closing room...", { id: "room:close" })

    try {
      const {
        message,
        description,
        error
      }: SocketResponse = await socket.emitWithAck("room:close", {})

      if (error) {
        throw ServerError.parser(error)
      }

      router.replace("/game/setup")
      toast.success(message, { description })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("room:close") }
  },

  async roomReady() {
    toast.loading("Updating your status...", { id: "room:ready" })

    try {
      const {
        data: ready,
        message,
        description,
        error
      }: SocketResponse<boolean> = await socket.emitWithAck("room:ready", {})

      if (error || typeof ready !== "boolean") {
        throw ServerError.parser(error)
      }

      set(({ currentRoomPlayer }) => {
        currentRoomPlayer.ready = ready
        return { currentRoomPlayer }
      })

      const toaster = ready ? toast.success : toast.info
      toaster(message, { id: "room:ready:response", description })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("room:ready") }
  },

  async roomKick() {
    toast.loading("Kicking player...", { id: "room:kick" })

    try {
      const {
        data: room,
        message,
        description,
        error
      }: SocketResponse<WaitingRoom> = await socket.emitWithAck("room:kick", {})

      if (error || !room) {
        throw ServerError.parser(error)
      }

      set(({ currentRoomPlayer }) => {
        currentRoomPlayer.ready = false
        return { currentRoomPlayer, room }
      })

      toast.success(message, { description, id: "room:kick:response" })
      set({ room })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("room:kick") }
  },

  async sessionClose() {
    toast.loading("Closing session...", { id: "session:close" })

    try {
      const {
        message,
        description,
        error
      }: SocketResponse = await socket.emitWithAck("session:close", {})

      if (error) {
        throw ServerError.parser(error)
      }

      toast.warning(message, { description, id: "session:close:response" })
      router.replace(`/game/summary/${initialRoom.slug}`)
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("session:close") }
  },

  /* Listeners */
  roomConnected({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.dismiss("room:connect")
    toast.dismiss("room:disconnected")
    toast.success(message, { description, id: "room:connected" })

    set({ room })
  },

  roomDisconnected({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.dismiss("room:connected")
    toast.warning(message, { description, id: "room:disconnected" })

    set(({ currentRoomPlayer }) => {
      currentRoomPlayer.ready = false
      return { room, currentRoomPlayer }
    })
  },

  roomLeft({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)
      
    toast.warning(message, { description })
    
    set(({ currentRoomPlayer }) => {
      currentRoomPlayer.ready = false
      return { room, currentRoomPlayer }
    })
  },

  roomClosed({ message, description, error }) {
    if (error) return handleServerError(error)

    toast.warning(message, { description })
    router.replace("/dashboard/rooms")
  },

  roomKicked({ message, description, error }) {
    if (error) return handleServerError(error)

    toast.warning(message, { description })
    socket.emit("connection:clear")
    router.replace("/dashboard/rooms")
  },

  async roomReadied({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)
        
    const toaster = room.status === "ready" ? toast.success : toast.info
    toaster(message, { id: "room:readied", description })
    set({ room })

    if (
      room.status !== "ready" ||
      currentPlayerId !== room.owner.id
    ) return

    try {
      const { serverError } = await createMultiplayerSession({
        settings: room.settings,
        slug: room.slug,
        guestId: room.guest.id
      }) || {}

      if (serverError) {
        ServerError.throw(serverError)
      }

      socket.emit("session:created")
    } catch (err) {
      socket.emit("session:starting:failed")

      handleServerError(err as ServerError)
      logError(err)
    }
  },

  sessionStartingFailed({ message, description, error }) {
    toast.dismiss("room:readied")

    if (error) handleServerError(error)
    else toast.warning(message, { description })

    router.replace("/game/setup")
  },

  sessionStarted({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.dismiss("room:ready:response")
    toast.dismiss("room:readied")
    toast.dismiss("session:created")      

    set({ room })
    toast.success(message, { description })
  },

  connectError({ data: error }) {
    if (error?.key === "CLERK_TOKEN_EXPIRED") {
      toast.warning(error.message, {
        id: "room:connect",
        description: error.description,
        duration: 10000,
        onAutoClose() { window.location.reload() },
        action: {
          label: "Reconnect",
          onClick() { window.location.reload() }
        }
      })
      return
    }

    if (socket.connected) return handleServerError(error)

    const toastId = "room:connect"
    const message = "Failed to connect to the server."

    const onAutoClose: ToastT["onAutoClose"] = () => {
      router.replace("/dashboard")
      toast.info("Redirecting to the dashboard...", {
        id: toastId,
        description: "Please try to reconnect later.",
        action: {
          label: "Reconnect",
          onClick() { router.push("/game/multiplayer") }
        }
      })
    }

    if (initialRoom.status === "waiting" || initialRoom.status === "joined") {
      const playerKey = currentPlayerKey(initialRoom.owner.id, currentPlayerId)

      toast.warning(message, {
        id: toastId,
        description: `You can ${playerKey === "owner" ? "close" : "leave"} the room without losing Elo points.`,
        duration: 10000,
        onAutoClose,
        action: {
          label: playerKey === "owner" ? "Close room" : "Leave room",
          async onClick() {
            toast.dismiss(toastId)

            const loadingMessage = playerKey === "owner"
              ? "Closing room..."
              : "Leaving room..."
            toast.loading(loadingMessage, { id: "room:leave" })

            try {
              const { serverError } = await leaveOrCloseRoom() || {}

              if (serverError) {
                handleServerError(serverError, `Failed to ${playerKey === "owner" ? "close" : "leave"} the room. Please try again later.`)
                return
              }

              toast.success(`You have ${playerKey === "owner" ? "closed" : "left"} the room.`, {
                id: "room:left",
                description: "This will not affect your Elo points."
              })
            } catch (err) {
              logError(err)
            } finally {
              toast.dismiss(toastId)
              toast.dismiss("room:leave")
            }
          }
        }
      })
    }

    if (initialRoom.status === "running" || initialRoom.status === "cancelled") {
      const description = "Do you want to force close this session?"

      if (initialRoom.session.mode === "RANKED") {
        description.concat(" You will lose Elo points.")
      }

      toast.warning(message, {
        id: toastId,
        description,
        duration: 10000,
        onAutoClose,
        action: {
          label: "Force close",
          async onClick() {
            toast.dismiss(toastId)
            toast.loading("Force closing session...", { id: "session:close" })

            try {
              const { serverError } = await forceCloseMultiplayerSession() || {}
              if (serverError) throw ServerError.parser(serverError)

              toast.success("You have force closed the session.", {
                id: "session:closed",
                description: initialRoom.session.mode === "CASUAL"
                  ? "This had no effect on your Elo points."
                  : "You have lost the maximum amount of points."
              })
            } catch (err) {
              const error = err as ServerError

              if (
                error.key === "SESSION_NOT_FOUND" ||
                error.key === "ROOM_NOT_FOUND"
              ) {
                router.replace(`/game/summary/${initialRoom.slug}`)
                toast.warning("Multiplayer session and room not found.", {
                  id: "session:close:error",
                  description: "This game session has already been closed."
                })
                return
              }

              handleServerError(error, "Failed to force close session. Please try again later.")
              logError(error)
            } finally {
              toast.dismiss(toastId)
              toast.dismiss("session:close")
            }
          }
        }
      })
    }
  },

  disconnect(reason) {
    if (
      reason === "io client disconnect" ||
      reason === "io server disconnect"
    ) return

    toast.warning("Connection has been lost with the server.", {
      id: "room:disconnect",
      description: "Your session has been likely cancelled. Please reconnect."
    })
  }
}))

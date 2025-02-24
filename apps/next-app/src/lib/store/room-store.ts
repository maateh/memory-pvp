import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { Socket } from "socket.io-client"
import type { ExtendedSocketError, SocketResponse } from "@repo/server/socket-types"
import type { RoomPlayer } from "@repo/schema/room-player"
import type { RoomVariants, JoinedRoom, WaitingRoom, RunningRoom, CancelledRoom } from "@repo/schema/room"

// server
import { createMultiSession } from "@/server/action/session-action"

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
}

type RoomListener = {
  roomConnected: (response: SocketResponse<RoomVariants>) => void
  roomDisconnected: (response: SocketResponse<JoinedRoom | CancelledRoom>) => void
  roomLeft: (response: SocketResponse<WaitingRoom>) => void
  roomClosed: (response: SocketResponse) => void
  roomKicked: (response: SocketResponse) => void
  roomReadied: (response: SocketResponse<JoinedRoom>) => Promise<void>
  sessionStarting: (response: SocketResponse) => void
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
    toast.loading("Update your status...", { id: "room:ready" })

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

    socket.emit("session:starting")

    try {
      const { serverError } = await createMultiSession({
        settings: room.settings,
        slug: room.slug,
        guestId: room.guest.id
      }) || {}

      if (serverError) {
        ServerError.throw({
          ...serverError,
          description: serverError.description || "Failed to initialize game session."
        })
      }

      socket.emit("session:created")
    } catch (err) {
      socket.emit("session:starting:failed")

      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("session:starting") }
  },

  sessionStarting({ message, description, error }) {
    if (error) return handleServerError(error)
    
    toast.loading(message, { id: "session:starting", description })
  },

  sessionStartingFailed({ message, description, error }) {
    toast.dismiss("session:starting")

    if (error) handleServerError(error)
    else toast.warning(message, { description })

    router.replace("/game/setup")
  },

  sessionStarted({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.dismiss("room:ready:response")
    toast.dismiss("room:readied")
    toast.dismiss("session:starting")
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

    handleServerError(error)
  },

  disconnect(reason) {
    if (
      reason === "io client disconnect" ||
      reason === "io server disconnect"
    ) return

    toast.warning("Connection has been lost with the server.", {
      description: "Your session has been likely cancelled. Please reconnect."
    })
  }
}))

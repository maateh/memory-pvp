import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { Socket } from "socket.io-client"
import type { SocketResponse } from "@repo/types/socket-api"
import type { RoomPlayer } from "@repo/schema/player"
import type { RoomConnectValidation } from "@repo/schema/session-room-validation"
import type {
  JoinedRoom,
  WaitingRoom,
  WaitingRoomVariants
} from "@repo/schema/session-room"
import type { SessionCreatedValidation } from "@repo/schema/session-room-validation"

// server
import { createMultiSession } from "@/server/action/session-action"

// utils
import { ServerError } from "@repo/server/error"
import { ApiError } from "@/server/_error"
import { handleServerError, logError } from "@/lib/util/error"

type RoomState = {
  room: WaitingRoomVariants
  currentRoomPlayer: RoomPlayer
}

type RoomAction = {
  roomConnect: () => Promise<void>
  roomLeave: () => Promise<void>
  roomClose: () => Promise<void>
  roomReady: () => Promise<void>
  roomKick: () => Promise<void>
}

type RoomListener = {
  roomConnected: (response: SocketResponse<JoinedRoom>) => void
  roomDisconnected: (response: SocketResponse<JoinedRoom>) => void
  roomLeft: (response: SocketResponse<WaitingRoom>) => void
  roomClosed: (response: SocketResponse) => void
  roomReadied: (response: SocketResponse<JoinedRoom>) => Promise<void>
  sessionStarting: (response: SocketResponse) => void
  sessionStarted: (response: SocketResponse<string>) => void
  disconnect: (reason: Socket.DisconnectReason) => void
}

export type RoomStore = RoomState & RoomAction & RoomListener

type RoomStoreProps = {
  initialRoom: WaitingRoomVariants
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
  async roomConnect() {
    toast.loading("Connecting to the room...", { id: "room:connect" })

    try {
      const {
        data: room,
        message,
        description,
        error
      }: SocketResponse<WaitingRoomVariants> = await socket.connect().emitWithAck("room:connect", {
        playerId: currentPlayerId
      } satisfies RoomConnectValidation)

      if (error || !room) {
        throw ServerError.parser(error)
      }

      toast.success(message, { description, id: "room:connect" })
      set({ room })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    }
  },

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

      if (error) {
        throw ServerError.parser(error)
      }

      const toaster = ready ? toast.success : toast.info
      toaster(message, { id: "room:ready:response", description })
    } catch (err) {
      handleServerError(err as ServerError)
      logError(err)
    } finally { toast.dismiss("room:ready") }
  },

  async roomKick() {
    // TODO: implement kicking user
  },

  /* Listeners */
  roomConnected({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.success(message, { description })
    set({ room })
  },

  roomDisconnected({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)

    toast.warning(message, { description })
    set({ room })
  },

  roomLeft({ data: room, message, description, error }) {
    if (error || !room) return handleServerError(error)
      
    toast.warning(message, { description })
    set({ room })
  },

  roomClosed({ message, description, error }) {
    if (error) return handleServerError(error)

    toast.warning(message, { description })
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
      const {
        message: startingMessage,
        description: startingDescription,
        error: startingError
      }: SocketResponse = await socket.emitWithAck("session:starting", {})

      if (startingError) {
        throw ServerError.parser(startingError)
      }

      toast.loading(startingMessage, {
        id: "session:starting",
        description: startingDescription
      })

      const { serverError } = await createMultiSession({
        ...room.settings,
        slug: room.slug,
        guestId: room.guest.id
      }) || {}

      if (serverError) {
        ApiError.throw({
          ...serverError,
          description: serverError.description || "Failed to initialize game session."
        })
      }

      socket.emit("session:created", { roomSlug: room.slug } satisfies SessionCreatedValidation)
      toast.info("Game session has been initialized.", {
        id: "session:created",
        description: "Starting the game session..."
      })
    } catch (err) {
      // TODO: emit `session:starting:failed`
      // socket.emit("session:starting:failed")

      handleServerError(err as ServerError | ApiError)
      logError(err)
    } finally { toast.dismiss("session:starting") }
  },

  sessionStarting({ message, description, error }) {
    if (error) return handleServerError(error)

    set(({ room }) => ({
      room: {
        ...room,
        status: "starting"
      } as JoinedRoom
    }))
    
    toast.loading(message, { id: "session:starting", description })
  },

  sessionStarted({ data: roomSlug, message, description, error }) {
    if (error || !roomSlug) return handleServerError(error)

    toast.dismiss("room:ready:response")
    toast.dismiss("room:readied")
    toast.dismiss("session:starting")
    toast.dismiss("session:created")      

    router.replace(`/game/${roomSlug}`)
    toast.success(message, { description })
  },

  disconnect(reason) {
    if (
      reason === "io client disconnect" ||
      reason === "io server disconnect"
    ) return

    // TODO: implement reconnections
    router.replace("/game/reconnect")
    toast.warning("Connection has been lost with the server.", {
      description: "Your session has been likely cancelled, but you can continue it if you want."
    })
  }
}))

import { createStore } from "zustand"
import { toast } from "sonner"

// types
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { Socket } from "socket.io-client"
import type { ToastT } from "sonner"
import type { ExtendedSocketError, SocketResponse } from "@repo/server/socket-types"
import type { RoomPlayer } from "@repo/schema/room-player"
import type { RoomVariants, JoinedRoom, WaitingRoom, RunningRoom } from "@repo/schema/room"

// server
import { ServerError } from "@repo/server/error"
import { createMultiSession } from "@/server/action/session-action"
import { leaveOrCloseRoom } from "@/server/action/room-action"

// helpers
import { currentPlayerKey } from "@repo/helper/player"

// utils
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
      router.replace("/game/setup")
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
      const { serverError } = await createMultiSession({
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

    if (!socket.connected) {
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
          description: `You can ${playerKey === "owner" ? "close" : "leave"} the room without losing any ranking scores.`,
          duration: 10000,
          onAutoClose,
          action: {
            label: playerKey === "owner" ? "Close" : "Leave",
            async onClick() {
              toast.dismiss(toastId)
              toast.loading(`${playerKey === "owner" ? "Closing" : "Leaving"} room...`, {
                id: "room:leave"
              })

              try {
                const { serverError } = await leaveOrCloseRoom() || {}
  
                if (serverError) {
                  handleServerError(serverError, `Failed to ${playerKey === "owner" ? "close" : "leave"} the room. Please try again later.`)
                  return
                }

                toast.success(`You have ${playerKey === "owner" ? "closed" : "left"} the room.`, {
                  id: "room:leave",
                  description: "This will not affect your ranking scores."
                })
              } catch (err) {
                logError(err)
              } finally { toast.dismiss(toastId) }
            }
          }
        })
      }

      if (initialRoom.status === "running" || initialRoom.status === "cancelled") {
        const description = "Do you want to force close this session?"

        if (initialRoom.session.type === "COMPETITIVE") {
          description.concat(" You will lose ranking scores.")
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
                // TODO: implement `forceCloseSession` server action
                // const { serverError } = await forceCloseSession() || {}

                // if (serverError) {
                //   handleServerError(serverError, "Failed to force close session. Please try again later.")
                //   return
                // }

                // toast.success("You have force closed the session.", {
                //   id: "session:close",
                //   description: initialRoom.session.type === "CASUAL"
                //     ? "This had no effect on your ranking scores."
                //     : "You have lost the maximum amount of ranking scores."
                // })

                toast.warning("Feature is currently under development.", {
                  description: "Force closing session has not been implemented yet."
                })
              } catch (err) {
                logError(err)
              } finally { toast.dismiss(toastId) }
            }
          }
        })
      }
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

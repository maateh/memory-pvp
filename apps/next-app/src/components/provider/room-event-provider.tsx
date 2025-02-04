"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SocketResponse } from "@repo/types/socket-api"
import type { JoinedRoom, RunningRoom, SessionRoom, SessionRoomPlayer, WaitingRoom } from "@repo/schema/session-room"
import type { SessionCreatedValidation } from "@repo/schema/session-room-validation"

// server
import { createMultiSession } from "@/server/action/session-action"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { ApiError } from "@/server/_error"
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type TRoomEventContext<T extends WaitingRoom | JoinedRoom | RunningRoom | SessionRoom = WaitingRoom | JoinedRoom | RunningRoom | SessionRoom> = {
  room: T
  currentRoomPlayer: SessionRoomPlayer
  roomLeave: () => Promise<void>
  roomClose: () => Promise<void>
  roomReady: () => Promise<void>
}

const RoomEventContext = createContext<TRoomEventContext | null>(null)

type RoomEventProviderProps = {
  initialRoom: WaitingRoom | JoinedRoom | SessionRoom | RunningRoom
  currentPlayerId: string
  children: React.ReactNode
}

const RoomEventProvider = ({ initialRoom, currentPlayerId, children }: RoomEventProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [room, setRoom] = useState<WaitingRoom | JoinedRoom | SessionRoom | RunningRoom>(initialRoom)
  const currentRoomPlayer = useMemo(() => {
    if (
      room.status === "waiting" ||
      room.owner.id === currentPlayerId
    ) return room.owner

    return room.guest
  }, [room, currentPlayerId])

  const roomLeave = async () => {
    toast.loading("Leaving room...", { id: "room:leave" })

    try {
      const {
        message,
        description,
        error
      }: SocketResponse = await socket?.emitWithAck("room:leave", {})

      if (error) {
        throw SocketError.parser(error)
      }

      router.replace("/dashboard/rooms")
      toast.success(message, { description })
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    } finally { toast.dismiss("room:leave") }
  }

  const roomClose = async () => {
    toast.loading("Closing room...", { id: "room:close" })

    try {
      const {
        message,
        description,
        error
      }: SocketResponse = await socket?.emitWithAck("room:close", {})

      if (error) {
        throw SocketError.parser(error)
      }

      router.replace("/game/setup")
      toast.success(message, { description })
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    } finally { toast.dismiss("room:close") }
  }

  const roomReady = async () => {
    toast.loading("Update your status...", { id: "room:ready" })

    try {
      const {
        data: ready,
        message,
        description,
        error
      }: SocketResponse<boolean> = await socket?.emitWithAck("room:ready", {})

      if (error) {
        throw SocketError.parser(error)
      }

      const toaster = ready ? toast.success : toast.info
      toaster(message, { id: "room:ready:response", description })
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    } finally { toast.dismiss("room:ready") }
  }

  useEffect(() => {
    if (!socket?.active) {
      router.replace('/game/setup')
      toast.error("Socket connection is not active.", {
        description: "Socket connection was not established. Please try again.",
        id: "_" /* Note: prevent re-render by adding a custom id. */
      })
      return
    }

    const roomJoined = ({ data: room, message, description, error }: SocketResponse<JoinedRoom>) => {
      if (error || !room) return handleServerError(error)

      setRoom(room)
      toast.success(message, { description })
    }

    const roomLeft = ({ data: room, message, description, error }: SocketResponse<WaitingRoom>) => {
      if (error || !room) return handleServerError(error)
      
      setRoom(room)
      toast.warning(message, { description })
    }

    const roomClosed = ({ message, description, error }: SocketResponse) => {
      if (error) return handleServerError(error)

      toast.warning(message, { description })
      router.replace("/dashboard/rooms")
    }

    const roomReadied = async ({ data: room, message, description, error }: SocketResponse<JoinedRoom>) => {
      if (error || !room) return handleServerError(error)
        
      const toaster = room.status === "ready" ? toast.success : toast.info
      toaster(message, { id: "room:readied", description })
      setRoom(room)

      if (
        room.status !== "ready" ||
        currentPlayerId !== room.owner.id
      ) return

      try {
        const {
          message: startingMessage,
          description: startingDescription,
          error: startingError
        }: SocketResponse = await socket?.emitWithAck("session:starting", {})
  
        if (startingError) {
          throw SocketError.parser(startingError)
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

        socket?.emit("session:created", { roomSlug: room.slug } satisfies SessionCreatedValidation)
        toast.info("Game session has been initialized.", {
          id: "session:created",
          description: "Starting the game session..."
        })
      } catch (err) {
        // TODO: emit `session:starting:failed`
        // socket.emit("session:starting:failed")

        handleServerError(err as SocketError | ApiError)
        logError(err)
      } finally { toast.dismiss("session:starting") }
    }

    const sessionStarting = ({ message, description, error }: SocketResponse) => {
      if (error) return handleServerError(error)

      setRoom((room) => ({ ...room, status: "starting" } as JoinedRoom))
      toast.loading(message, { id: "session:starting", description })
    }
    
    const sessionStarted = ({ data: roomSlug, message, description, error }: SocketResponse<string>) => {
      if (error || !roomSlug) return handleServerError(error)

      toast.dismiss("room:ready:response")
      toast.dismiss("room:readied")
      toast.dismiss("session:starting")
      toast.dismiss("session:created")      

      router.replace(`/game/${roomSlug}`)
      toast.success(message, { description })
    }

    const disconnect = () => {
      // TODO: This is a temporary route.
      // `/game/reconnect` will be the route to handle session recovery.
      router.replace("/game/setup")
      toast.warning("Connection has been lost with the server.", {
        description: "Your session has been likely cancelled, so you can continue it whenever you want."
      })
    }

    socket.on("room:joined", roomJoined)
    socket.on("room:left", roomLeft)
    socket.on("room:closed", roomClosed)
    socket.on("room:readied", roomReadied)
    socket.on("session:starting", sessionStarting)
    socket.on("session:started", sessionStarted)
    socket.on("disconnect", disconnect)

    return () => {
      socket.off("room:joined", roomJoined)
      socket.off("room:left", roomLeft)
      socket.off("room:closed", roomClosed)
      socket.off("room:readied", roomReadied)
      socket.off("session:starting", sessionStarting)
      socket.off("session:started", sessionStarted)
      socket.off("disconnect", disconnect)
    }
  }, [router, socket, currentPlayerId])

  return (
    <RoomEventContext.Provider value={{
      room,
      currentRoomPlayer,
      roomLeave,
      roomClose,
      roomReady
    }}>
      {children}
    </RoomEventContext.Provider>
  )
}

function useRoomEvents<T extends WaitingRoom | JoinedRoom | RunningRoom | SessionRoom>() {
  const context = useContext(RoomEventContext) as TRoomEventContext<T> | null

  if (!context) {
    throw new Error('Room events must be used within its provider.')
  }

  return context
}

export default RoomEventProvider
export { useRoomEvents }

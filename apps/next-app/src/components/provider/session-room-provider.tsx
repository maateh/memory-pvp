"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { JoinedRoom, SessionRoom, SessionRoomPlayer, WaitingRoom } from "@repo/schema/session-room"
import type { SocketResponse } from "@repo/types/socket-api"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { handleServerError, logError } from "@/lib/util/error"

// providers
import { SessionStoreProvider } from "@/components/provider"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type TSessionRoomContext<T extends WaitingRoom | JoinedRoom | SessionRoom = WaitingRoom | JoinedRoom | SessionRoom> = {
  room: T
  currentRoomPlayer: SessionRoomPlayer
  roomLeave: () => Promise<void>
  roomClose: () => Promise<void>
  roomReady: () => Promise<void>
}

const SessionRoomContext = createContext<TSessionRoomContext | null>(null)

type SessionRoomProviderProps = {
  initialRoom: WaitingRoom | JoinedRoom | SessionRoom
  currentPlayerId: string
  children: React.ReactNode
}

const SessionRoomProvider = ({ initialRoom, currentPlayerId, children }: SessionRoomProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [room, setRoom] = useState(initialRoom)
  const currentRoomPlayer = useMemo(() => {
    if (
      room.status === "waiting" ||
      room.owner.id === currentPlayerId
    ) return room.owner

    return room.guest
  }, [room, currentPlayerId])

  const roomLeave = async () => {
    toast.info("Leaving room...")

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
    }
  }

  const roomClose = async () => {
    toast.info("Closing room...")

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
    }
  }

  const roomReady = async () => {
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
      toaster(message, { description })
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    }
  }

  useEffect(() => {
    if (!socket?.active) {
      router.replace('/game/setup')
      toast.error("Session room is not available.", {
        description: "Socket connection was not established. Please try again later.",
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
      toaster(message, { description })
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

        toast.loading(startingMessage, { description: startingDescription })

        // TODO: initalize game session here

        const {
          data: room,
          message: createdMessage,
          description: createdDescription,
          error: createdError
        }: SocketResponse<SessionRoom> = await socket?.emitWithAck("session:created", {})

        if (createdError || !room) {
          throw SocketError.parser(createdError)
        }
        
        setRoom(room)
        toast.success(createdMessage, { description: createdDescription })
      } catch (err) {
        handleServerError(err as SocketError)
        logError(err)
      }
    }

    const sessionStarting = ({ message, description, error }: SocketResponse) => {
      if (error) return handleServerError(error)

      setRoom((room) => ({ ...room, status: "starting" } as JoinedRoom))
      toast.loading(message, { description })
    }
    
    const sessionStarted = ({ data: room, message, description, error }: SocketResponse<SessionRoom>) => {
      if (error || !room) return handleServerError(error)

      setRoom(room)
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
    <SessionRoomContext.Provider value={{ room, currentRoomPlayer, roomLeave, roomClose, roomReady }}>
      {room.status === "running" ? (
        <SessionStoreProvider session={room.session}>
          {children}
        </SessionStoreProvider>
      ) : children}
    </SessionRoomContext.Provider>
  )
}

function useSessionRoom<T extends WaitingRoom | JoinedRoom | SessionRoom>() {
  const context = useContext(SessionRoomContext) as TSessionRoomContext<T> | null

  if (!context) {
    throw new Error('Session room context must be used within its provider.')
  }

  return context
}

export default SessionRoomProvider
export { useSessionRoom }

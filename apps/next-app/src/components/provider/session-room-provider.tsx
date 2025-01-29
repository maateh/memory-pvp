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
      const { message, error } = await socket?.timeout(5000)
        .emitWithAck("room:leave", {}) as SocketResponse<null>

      if (error) {
        throw SocketError.parser(error)
      }

      router.replace("/game/setup")
      toast.success(message)
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    }
  }

  const roomClose = async () => {
    toast.info("Closing room...")

    try {
      const { message, error } = await socket?.timeout(5000)
        .emitWithAck("room:close", {}) as SocketResponse<null>

      if (error) {
        throw SocketError.parser(error)
      }

      router.replace("/game/setup")
      toast.success(message)
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    }
  }

  const roomReady = async () => {
    // TODO:
    // - display action button for both joined players (make button toggleable -> ready/unready)
    // - update session room
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

    const roomJoined = ({ data: room, message, error }: SocketResponse<JoinedRoom>) => {
      if (error || !room) return handleServerError(error)

      setRoom(room)
      toast.success(message)
    }

    const roomLeft = ({ data: room, message, error }: SocketResponse<WaitingRoom>) => {
      if (error || !room) return handleServerError(error)
      
      setRoom(room)
      toast.warning(message)
    }

    const roomClosed = ({ message, error }: SocketResponse<null>) => {
      if (error) return handleServerError(error)

      toast.warning(message)
      router.replace("/game/setup")
    }

    const roomReadied = () => {
      // TODO:
      // - if both users are ready -> initalize game session on the owner player side
      //   -> on the start -> emit "session:starting"
      //   -> after session is created -> emit "session:created" and emit session data
    }

    const sessionStarting = () => {
      // TODO:
      // - notify joined players that the session is currently under initialization
    }
    
    const sessionStarted = () => {
      // TODO:
      // - notify joined players that the session has been started
      // - no need to redirect, just update the session room status on redis
    }

    const disconnect = () => {
      // TODO:
      // - notify the player that the room has been closed due to a server issue
      // - redirect the user to the setup page
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
  }, [router, socket])

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

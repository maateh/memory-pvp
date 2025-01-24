"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { JoinedRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"
import type { SocketResponse } from "@repo/types/socket-api"

// utils
import { handleServerError } from "@/lib/util/error"

// providers
import { SessionStoreProvider } from "@/components/provider"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type TSessionRoomContext<T extends WaitingRoom | JoinedRoom | SessionRoom = WaitingRoom | JoinedRoom | SessionRoom> = {
  room: T
  roomLeave: () => Promise<void>
  roomClose: () => Promise<void>
  roomReady: () => Promise<void>
}

const SessionRoomContext = createContext<TSessionRoomContext | null>(null)

type SessionRoomProviderProps = {
  initialRoom: WaitingRoom | JoinedRoom | SessionRoom
  children: React.ReactNode
}

const SessionRoomProvider = ({ initialRoom, children }: SessionRoomProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [room, setRoom] = useState(initialRoom)

  // TODO: additionally, a custom `useJoinWaitingRoom` hook will be required,
  // similarly to the `useCreateWaitingRoom`

  const roomLeave = async () => {
    // TODO:
    // - display action button only for the guest player (disable button if the guest player is ready)
    // - remove session player connection from redis + update session room
  }

  const roomClose = async () => {
    // TODO:
    // - display action button only for the room owner (disable button if the owner player is ready)
    // - remove player connections from redis
    // - remove session room from redis
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
      if (!error && room) {
        setRoom(room)
        toast.success(message)
        return
      }

      handleServerError(error)
    }

    const roomLeft = () => {
      // TODO:
      // - notify the joined player that the other player has left
    }

    const roomClosed = () => {
      // TODO:
      // - notify joined players that the room has been closed
      // - redirect players to the setup page after room has been closed
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

    socket.on("room:joined", roomJoined)
    socket.on("room:left", roomLeft)
    socket.on("room:closed", roomClosed)
    socket.on("room:readied", roomReadied)
    socket.on("session:starting", sessionStarting)
    socket.on("session:started", sessionStarted)

    return () => {
      socket.off("room:joined", roomJoined)
      socket.off("room:left", roomLeft)
      socket.off("room:closed", roomClosed)
      socket.off("room:readied", roomReadied)
      socket.off("session:starting", sessionStarting)
      socket.off("session:started", sessionStarted)
    }
  }, [router, socket])

  return (
    <SessionRoomContext.Provider value={{ room, roomLeave, roomClose, roomReady }}>
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

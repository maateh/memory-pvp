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

type TSessionRoomContext = {
  room: WaitingRoom | JoinedRoom | SessionRoom
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

    socket.on("room:joined", roomJoined)

    return () => {
      socket.off("room:joined", roomJoined)
    }
  }, [router, socket])

  return (
    <SessionRoomContext.Provider value={{ room }}>
      {room.status === "running" ? (
        <SessionStoreProvider session={room.session}>
          {children}
        </SessionStoreProvider>
      ) : children}
    </SessionRoomContext.Provider>
  )
}

function useSessionRoom() {
  const context = useContext(SessionRoomContext)

  if (!context) {
    throw new Error('Session room context must be used within its provider.')
  }

  return context
}

export default SessionRoomProvider
export { useSessionRoom }

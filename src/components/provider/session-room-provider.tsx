"use client"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// providers
import { SessionStoreProvider } from "@/components/provider"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type TSessionRoomContext = {
  room: {} // TODO: add `SessionRoom` type
}

const SessionRoomContext = createContext<TSessionRoomContext | null>(null)

type SessionRoomProviderProps = {
  initialRoom: {} // TODO: add `SessionRoom` type
  children: React.ReactNode
}

const SessionRoomProvider = ({ initialRoom, children }: SessionRoomProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [room, setRoom] = useState(initialRoom)
  const [session, setSession] = useState()

  useEffect(() => {
    if (!socket?.active) {
      router.replace('/game/setup')
      toast.error("Session room is not available.", {
        description: "Socket connection was not established. Please try again later.",
        id: "_" /* Note: prevent re-render by adding a custom id. */
      })
      return
    }

    const roomJoined = ({  }: {  }) => {
      // TODO: update room status to 'READY'
      // TODO: create session then emit created session
      console.info("SOCKET -> roomJoined")
    }

    const startSession = ({  }: {  }) => {
      // TODO: load session to the session store
      // TODO: redirect to `/game/multiplayer`
      console.info("SOCKET -> startSession")
    }

    socket.on("room:joined", roomJoined)
    socket.on("session:start", startSession)

    return () => {
      socket.off("room:joined", roomJoined)
      socket.off("session:start", startSession)
    }
  }, [router, socket])

  return (
    <SessionRoomContext.Provider value={{ room }}>
      {session ? (
        <SessionStoreProvider session={session}>
          {children}
        </SessionStoreProvider>
      ) : (
        <div>Waiting for another player to join...</div> // TODO: fallback
      )}
    </SessionRoomContext.Provider>
  )
}

export default SessionRoomProvider

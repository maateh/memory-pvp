"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SocketResponse } from "@repo/types/socket-api"
import type { ClientPlayer } from "@repo/schema/player"
import type { ClientGameSession } from "@repo/schema/session"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type TSessionEventContext = {
  session: ClientGameSession
  currentPlayer: ClientPlayer
}

const SessionEventContext = createContext<TSessionEventContext | null>(null)

type SessionEventProviderProps = {
  initialSession: ClientGameSession
  currentPlayer: ClientPlayer
  children: React.ReactNode
}

const SessionEventProvider = ({ initialSession, currentPlayer, children }: SessionEventProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [session, setSession] = useState<ClientGameSession>(initialSession)

  const handleCardFlip = async () => {
    try {
      // TODO: implement card flip event
    } catch (err) {
      handleServerError(err as SocketError)
      logError(err)
    }
  }

  useEffect(() => {
    if (!socket.active) {
      router.replace('/game/setup')
      toast.error("Socket connection is not active.", {
        description: "Socket connection was not established. Please try again.",
        id: "_" /* Note: prevent re-render by adding a custom id. */
      })
      return
    }

    // TODO: implement event listeners

    const sessionUpdated = () => {}

    socket.on("session:updated", sessionUpdated)

    return () => {
      socket.off("session:updated", sessionUpdated)
    }
  }, [router, socket])

  return (
    <SessionEventContext.Provider value={{ session, currentPlayer }}>
      {children}
    </SessionEventContext.Provider>
  )
}

function useSessionEvents() {
  const context = useContext(SessionEventContext)

  if (!context) {
    throw new Error('Session events must be used within its provider.')
  }

  return context
}

export default SessionEventProvider
export { useSessionEvents }

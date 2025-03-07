"use client"

import { createContext, useContext, useState } from "react"
import { toast } from "sonner"

// types
import type { Socket } from "socket.io-client"

// socket.io
import { io } from "socket.io-client"

type TSocketServiceContext = {
  socket: Socket
}

const SocketServiceContext = createContext<TSocketServiceContext | null>(null)

type SocketServiceProviderProps = {
  authToken: string | null
  children: React.ReactNode
}

const SocketServiceProvider = ({ authToken, children }: SocketServiceProviderProps) => {
  const [socket] = useState(() => {
    if (typeof window === "undefined") return null

    return io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      auth: { token: authToken },
      ackTimeout: 7000,
      reconnectionAttempts: 3,
      autoConnect: false
    })
  })

  return (
    <SocketServiceContext.Provider value={{ socket: socket! }}>
      {children}
    </SocketServiceContext.Provider>
  )
}

function useSocketService() {
  const context = useContext(SocketServiceContext)

  if (!context) {
    throw new Error("Socket service must be used within its provider.")
  }

  /**
   * Note: Prevent throwing an error on the server side
   * because the socket instance is not initialized there.
   * 
   * Since the server will not use it, it makes more sense to
   * return back the context without the initialized socket
   * rather than throwing an unnecessary error.
   */
  if (typeof window === "undefined") {
    return context
  }

  if (!context.socket) {
    toast.error("Socket service is not initialized.", {
      description: "Multiplayer services might not work. Please try to reach an administrator.",
      id: "_" /* Note: prevent re-render by adding a custom id. */
    })

    throw new Error("Socket service is not initialized. Please try to reach an administrator.")
  }

  return context
}

export default SocketServiceProvider
export { useSocketService }

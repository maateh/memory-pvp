"use client"

import { createContext, useContext, useState } from "react"
import { toast } from "sonner"

// types
import type { Socket } from "socket.io-client"

// socket.io
import { io } from "socket.io-client"

type TSocketServiceContext = {
  socket: Socket | null
}

const SocketServiceContext = createContext<TSocketServiceContext | null>(null)

const SocketServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket] = useState(() => {
    if (typeof window === "undefined") return null
    return io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      autoConnect: false
    })
  })

  return (
    <SocketServiceContext.Provider value={{ socket }}>
      {children}
    </SocketServiceContext.Provider>
  )
}

function useSocketService() {
  const context = useContext(SocketServiceContext)

  if (!context) {
    throw new Error("Socket service must be used within its provider.")
  }

  if (!context.socket && typeof window !== "undefined") {
    toast.error("Socket server is not initialized.", {
      description: "Multiplayer services might not work. Please try to reach an administrator.",
      id: "_" /* Note: prevent re-render by adding a custom id. */
    })
  }

  return context
}

export default SocketServiceProvider
export { useSocketService }

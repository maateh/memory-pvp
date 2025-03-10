"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "zustand"

// types
import type { StoreApi } from "zustand"
import type { RoomStore } from "@/lib/store/room-store"
import type { RoomVariants } from "@repo/schema/room"

// store
import { roomStore } from "@/lib/store/room-store"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

const RoomStoreContext = createContext<StoreApi<RoomStore> | null>(null)

type RoomStoreProviderProps = {
  initialRoom: RoomVariants
  currentPlayerId: string
  children: React.ReactNode
}

const RoomStoreProvider = ({ initialRoom, currentPlayerId, children }: RoomStoreProviderProps) => {
  const router = useRouter()
  const { socket } = useSocketService()

  const [store] = useState(
    roomStore({
      initialRoom,
      currentPlayerId,
      socket,
      router
    })
  )

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    const {
      roomConnected,
      roomDisconnected,
      roomLeft,
      roomClosed,
      roomKicked,
      roomReadied,
      sessionStartingFailed,
      sessionStarted,
      connectError,
      disconnect
    } = store.getState()

    socket.on("room:connected", roomConnected)
    socket.on("room:disconnected", roomDisconnected)
    socket.on("room:left", roomLeft)
    socket.on("room:closed", roomClosed)
    socket.on("room:kicked", roomKicked)
    socket.on("room:readied", roomReadied)
    socket.on("session:starting:failed", sessionStartingFailed)
    socket.on("session:started", sessionStarted)

    socket.on("connect_error", connectError)
    socket.on("disconnect", disconnect)

    return () => {
      socket.off("room:connected", roomConnected)
      socket.off("room:disconnected", roomDisconnected)
      socket.off("room:left", roomLeft)
      socket.off("room:closed", roomClosed)
      socket.off("room:kicked", roomKicked)
      socket.off("room:readied", roomReadied)
      socket.off("session:starting:failed", sessionStartingFailed)
      socket.off("session:started", sessionStarted)

      socket.off("connect_error", connectError)
      socket.off("disconnect", disconnect)
    }
  }, [socket, store])

  return (
    <RoomStoreContext.Provider value={store}>
      {children}
    </RoomStoreContext.Provider>
  )
}

function useRoomStore<T>(selector: (state: RoomStore) => T) {
  const context = useContext(RoomStoreContext)

  if (!context) {
    throw new Error("Room store must be used within its provider.")
  }

  return useStore(context, selector)
}

export default RoomStoreProvider
export { useRoomStore }

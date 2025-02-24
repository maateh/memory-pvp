"use client"

// settings
import { roomHeaderMap } from "@/config/room-settings"

// components
import { RedirectFallback } from "@/components/shared"
import MultiGameHandler from "./multi-game-handler"

// providers
import { MultiSessionStoreProvider } from "@/components/provider"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"

const MultiSessionLoader = () => {
  const room = useRoomStore((state) => state.room)

  if (room.status === "running") {
    return (
      <MultiSessionStoreProvider initialSession={room.session}>
        <MultiGameHandler />
      </MultiSessionStoreProvider>
    )
  }

  const href = room.status === "finished"
    ? `/game/summary/${room.slug}`
    : "/game/multiplayer/connect"

  return (
    <RedirectFallback
      redirect={href}
      type="replace"
      message={roomHeaderMap[room.status].title}
      description={roomHeaderMap[room.status].description}
    />
  )
}

export default MultiSessionLoader

"use client"

// settings
import { roomHeaderMap } from "@/config/room-settings"

// layouts
import BaseGameLayout from "@/app/game/(base)/layout"

// components
import { RedirectFallback } from "@/components/shared"
import MultiGameHandler from "./multi-game-handler"
import RoomScreen from "./room-screen"

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

  if (room.status === "finished") {
    return (
      <RedirectFallback
        redirect={`/game/summary/${room.slug}`}
        type="replace"
        message={roomHeaderMap[room.status].title}
        description={roomHeaderMap[room.status].description}
      />
    )
  }

  return (
    <BaseGameLayout>
      <RoomScreen />
    </BaseGameLayout>
  )
}

export default MultiSessionLoader

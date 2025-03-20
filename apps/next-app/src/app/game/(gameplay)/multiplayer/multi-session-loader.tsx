"use client"

// settings
import { roomHeaderMap } from "@/config/room-settings"

// layouts
import GameMenuLayout from "@/app/game/(menu)/layout"

// components
import { RedirectFallback } from "@/components/shared"
import MultiGameHandler from "./multi-game-handler"
import RoomScreen from "./room-screen"

// providers
import { MultiEventStoreProvider, SessionStoreProvider } from "@/components/provider"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"

const MultiSessionLoader = () => {
  const room = useRoomStore((state) => state.room)
  const currentRoomPlayer = useRoomStore((state) => state.currentRoomPlayer)

  if (room.status === "running") {
    return (
      <SessionStoreProvider
        currentPlayer={currentRoomPlayer}
        initialSession={room.session}
      >
        <MultiEventStoreProvider>
          <MultiGameHandler />
        </MultiEventStoreProvider>
      </SessionStoreProvider>
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
    <GameMenuLayout>
      <RoomScreen />
    </GameMenuLayout>
  )
}

export default MultiSessionLoader

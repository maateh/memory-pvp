"use client"

// components
import { RedirectFallback } from "@/components/shared"
import MultiGameHandler from "./multi-game-handler"

// providers
import { MultiSessionStoreProvider } from "@/components/provider"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"

const MultiSessionLoader = () => {
  const room = useRoomStore((state) => state.room)

  if (room.status === "finished") {
    return (
      <RedirectFallback
        redirect="/game/setup"
        type="replace"
        message="Session is finished."
        description="The game has already ended in this room."
      />
    )
  }

  if (room.status === "running") {
    return (
      <MultiSessionStoreProvider initialSession={room.session}>
        <MultiGameHandler />
      </MultiSessionStoreProvider>
    )
  }
  
  // TODO: add room status `cancelled`
  //  -> show different message & description
  return (
    <RedirectFallback
      redirect="/game/multiplayer/connect"
      type="replace"
      message="Session has not started yet."
      description="You will be redirected to the room page."
    />
  )
}

export default MultiSessionLoader

"use client"

// components
import { RedirectFallback } from "@/components/shared"
import { SessionFooter, SessionHeader } from "@/components/session/ingame"
import WaitingRoomScreen from "./waiting-room-screen"
import MultiGameHandler from "./multi-game-handler"

// hooks
import { useRoomEvents } from "@/components/provider/room-event-provider"

const RoomStatusHandler = () => {
  const { room } = useRoomEvents()

  if (
    room.status === "waiting" ||
    room.status === "joined" ||
    room.status === "ready" ||
    room.status === "starting"
  ) return <WaitingRoomScreen />

  if (room.status === "running") {
    return (
      <>
        <SessionHeader />
        <MultiGameHandler />
        <SessionFooter />
      </>
    )
  }

  return (
    <RedirectFallback
      message="Unexpected room status."
      description="Session room data looks to be corrupted. Please try creating or joining another room."
      redirect="/game/setup"
      type="replace"
    />
  )
}

export default RoomStatusHandler

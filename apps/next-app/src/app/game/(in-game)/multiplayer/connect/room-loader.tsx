"use client"

// components
import { RedirectFallback } from "@/components/shared"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"
import RoomScreen from "./room-screen"

const RoomLoader = () => {
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
    <RedirectFallback
      redirect="/game/multiplayer"
      type="replace"
      message="Session is already running."
      description="Please reconnect."
    />
  }
  
  return <RoomScreen />
}

export default RoomLoader

"use client"

// components
import { RedirectFallback } from "@/components/shared"
import { SessionFooter, SessionHeader } from "@/components/session/ingame"
import {
  FinishedRoomScreen,
  JoinedRoomScreen,
  ReadyRoomScreen,
  StartingRoomScreen,
  WaitingRoomScreen
} from "@/components/session/room"
import MultiGameHandler from "./multi-game-handler"

// hooks
import { useSessionRoom } from "@/components/provider/session-room-provider"

const RoomStatusHandler = () => {
  const { room } = useSessionRoom()

  const render = () => {
    switch (room.status) {
      case "waiting": return <WaitingRoomScreen />
      case "joined": return <JoinedRoomScreen />
      case "ready": return <ReadyRoomScreen />
      case "starting": return <StartingRoomScreen />
      case "running": return (
        <>
          <SessionHeader />
          <MultiGameHandler />
          <SessionFooter />
        </>
      )
      case "finished": return <FinishedRoomScreen />
      default: return (
        <RedirectFallback
          message="Unexpected room status."
          description="Session room data looks to be corrupted. Please try creating or joining another room."
          redirect="/game/setup"
          type="replace"
        />
      )
    }
  }

  return render()
}

export default RoomStatusHandler

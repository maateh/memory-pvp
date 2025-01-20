// types
import type { WaitingRoom } from "@repo/schema/session-room"

// providers
import { SessionRoomProvider } from "@/components/provider"

// components
import RoomStatusHandler from "./room-status-handler"

const MultiGamePage = async () => {
  const room = {} as WaitingRoom // TODO: await getWaitingRoom()

  return (
    <SessionRoomProvider initialRoom={room}>
      <RoomStatusHandler />
    </SessionRoomProvider>
  )
}

export default MultiGamePage

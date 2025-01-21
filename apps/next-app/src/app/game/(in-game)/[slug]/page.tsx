import { redirect } from "next/navigation"

// types
import type { JoinedRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"

// providers
import { SessionRoomProvider } from "@/components/provider"

// components
import RoomStatusHandler from "./room-status-handler"

type MultiGamePageProps = {
  params: {
    slug: string
  }
}

const MultiGamePage = async ({ params }: MultiGamePageProps) => {
  const storeKey = `memory:session_rooms:${params.slug}`
  const room = await redis.hgetall<WaitingRoom | JoinedRoom | SessionRoom>(storeKey)
  if (!room) redirect('/game/setup')

  return (
    <SessionRoomProvider initialRoom={room}>
      <RoomStatusHandler />
    </SessionRoomProvider>
  )
}

export default MultiGamePage

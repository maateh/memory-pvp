import { redirect } from "next/navigation"

// types
import type { JoinedRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"

// server
import { redis } from "@/server/redis"
import { getPlayer } from "@/server/db/query/player-query"

// config
import { roomKey } from "@repo/config/redis-keys"

// providers
import { RoomEventProvider } from "@/components/provider"

// components
import RoomStatusHandler from "./room-status-handler"

type MultiGamePageProps = {
  params: {
    slug: string
  }
}

const MultiGamePage = async ({ params }: MultiGamePageProps) => {
  const player = await getPlayer({ filter: { isActive: true } })
  if (!player) {
    // TODO: create proper fallback for this
    redirect('/game/setup')
  }

  const room = await redis.json.get<WaitingRoom | JoinedRoom | SessionRoom>(roomKey(params.slug))
  if (!room) redirect('/game/setup')

  return (
    <RoomEventProvider initialRoom={room} currentPlayerId={player.id}>
      <RoomStatusHandler />
    </RoomEventProvider>
  )
}

export default MultiGamePage

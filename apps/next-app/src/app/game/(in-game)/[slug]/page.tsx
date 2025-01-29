import { redirect } from "next/navigation"

// redis
import { getSessionRoom } from "@/server/redis/room-commands"

// providers
import { SessionRoomProvider } from "@/components/provider"

// components
import RoomStatusHandler from "./room-status-handler"
import { getPlayer } from "@/server/db/query/player-query"

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

  const room = await getSessionRoom(params.slug)
  if (!room) redirect('/game/setup')
    
  return (
    <SessionRoomProvider initialRoom={room} currentPlayerId={player.id}>
      <RoomStatusHandler />
    </SessionRoomProvider>
  )
}

export default MultiGamePage

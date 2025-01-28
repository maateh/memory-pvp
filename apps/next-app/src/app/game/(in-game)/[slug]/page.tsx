import { redirect } from "next/navigation"

// redis
import { getSessionRoom } from "@/server/redis/room-commands"

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
  const room = await getSessionRoom(params.slug)
  if (!room) redirect('/game/setup')
    
  return (
    <SessionRoomProvider initialRoom={room}>
      <RoomStatusHandler />
    </SessionRoomProvider>
  )
}

export default MultiGamePage

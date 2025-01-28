// server
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getWaitingRooms } from "@/server/redis/room-commands"

// components
import { WaitingRoomListing } from "@/components/room/listing"

const WaitingRoomsPage = async () => {
  const player = await getPlayer({
    filter: { isActive: true },
    withAvatar: true
  })

  if (!player) {
    // TODO: create fallback layout for this
    return <>Please, create a player first</>
  }

  // TODO: add filter/sort/pagination options
  const rooms = await getWaitingRooms()

  return (
    <WaitingRoomListing
      guestPlayer={player}
      rooms={rooms}
    />
  )
}

export default WaitingRoomsPage

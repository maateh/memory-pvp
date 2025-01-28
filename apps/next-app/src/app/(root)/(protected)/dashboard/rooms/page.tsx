// server
import { getPlayer } from "@/server/db/query/player-query"

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

  // TODO: fetch waiting rooms
  // TODO: add filter/sort/pagination options

  return (
    <WaitingRoomListing
      guestPlayer={player}
      rooms={[]}
    />
  )
}

export default WaitingRoomsPage

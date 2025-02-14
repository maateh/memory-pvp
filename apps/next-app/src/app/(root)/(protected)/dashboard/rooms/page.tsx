import { Suspense } from "react"

// server
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getWaitingRooms } from "@repo/server/redis-commands"

// components
import { WaitingRoomListing } from "@/components/room/listing"
import { Await, RedirectFallback } from "@/components/shared"

const WaitingRoomsPage = async () => {
  const promises = Promise.all([
    getPlayer({
      filter: { isActive: true },
      withAvatar: true
    }),
    // TODO: add filter/sort/pagination options
    getWaitingRooms() 
  ])

  return (
    <Suspense fallback={<>Loading...</>}> {/* TODO: loading fallback */}
      <Await promise={promises}>
        {([player, rooms]) => {
          if (!player) {
            return (
              <RedirectFallback
                type="replace"
                message="Active player profile not found."
                description="Please create a player profile first."
              />
            )
          }

          return (
            <WaitingRoomListing
              guestPlayer={player}
              rooms={rooms}
            />
          )
        }}
      </Await>
    </Suspense>
  )
}

export default WaitingRoomsPage

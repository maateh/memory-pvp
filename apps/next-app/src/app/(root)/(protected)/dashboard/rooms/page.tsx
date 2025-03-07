import { Suspense } from "react"

// server
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getActiveRoom, getWaitingRooms } from "@repo/server/redis-commands"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { ActiveRoom } from "@/components/room"
import { WaitingRoomListing, WaitingRoomListingSkeleton } from "@/components/room/listing"

const WaitingRoomsPage = async () => {
  return (
    <Suspense fallback={<WaitingRoomListingSkeleton />}>
      <Await promise={getPlayer({
        filter: { isActive: true },
        withAvatar: true
      })}>
        {(player) => player ? (
          <Await promise={Promise.all([
            getActiveRoom(player.id),
            // TODO: add filter/sort/pagination options
            getWaitingRooms()
          ])}>
            {([activeRoom, rooms]) => (
              <>
                {activeRoom && (
                  <>
                    <ActiveRoom room={activeRoom} />

                    <Separator className="my-6 bg-border/40" />
                  </>
                )}

                <WaitingRoomListing
                  guestPlayer={player}
                  rooms={rooms}
                />
              </>
            )}
          </Await>
        ) : (
          <RedirectFallback
            type="replace"
            message="Active player profile not found."
            description="Please create a player profile first."
          />
        )}
      </Await>
    </Suspense>
  )
}

export default WaitingRoomsPage

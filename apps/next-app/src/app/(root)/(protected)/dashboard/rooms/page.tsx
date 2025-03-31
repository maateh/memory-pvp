import { Suspense } from "react"

// server
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getActiveRoom, getWaitingRooms } from "@repo/server/redis-commands"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { ActiveRoomCard } from "@/components/room"
import { WaitingRoomListing, WaitingRoomListingSkeleton } from "@/components/room/listing"

const WaitingRoomsPage = async () => {
  return (
    <Suspense fallback={<WaitingRoomListingSkeleton />}>
      <Await promise={getPlayer({ isActive: true }, "withAvatar")}>
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
                    <ActiveRoomCard room={activeRoom} />

                    <Separator className="my-6 bg-border/40" />
                  </>
                )}

                <WaitingRoomListing rooms={rooms} />
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

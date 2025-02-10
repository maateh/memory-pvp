import { Suspense } from "react"
import dynamic from "next/dynamic"

// types
import type { RoomVariants, WaitingRoomVariants } from "@repo/schema/session-room"

// server
import { redis } from "@/server/redis"
import { getPlayer } from "@/server/db/query/player-query"

// config
import { roomKey } from "@repo/config/redis-keys"

// components
import { Await, RedirectFallback } from "@/components/shared"
import WaitingRoomScreen from "./waiting-room-screen"

// providers
const RoomStoreProvider = dynamic(() => import("@/components/provider/room-store-provider"), { ssr: false })

type WaitingRoomPageProps = {
  params: {
    slug: string
  }
}

const WaitingRoomPage = async ({ params }: WaitingRoomPageProps) => {
  const promises = Promise.all([
    redis.json.get<RoomVariants>(roomKey(params.slug)),
    getPlayer({ filter: { isActive: true } })
  ])

  return (
    <Suspense fallback={<>Loading...</>}> {/* TODO: loading fallback */}
      <Await promise={promises}>
        {([room, player]) => {
          if (!room || !player) {
            return (
              <RedirectFallback
                redirect="/dashboard/rooms"
                type="replace"
                message="Session room cannot be loaded."
                description="Unable to find this session room."
              />
            )
          }

          if (room.status === "finished") {
            return (
              <RedirectFallback
                redirect="/dashboard/rooms"
                type="replace"
                message="Session is finished."
                description="The session has already ended in this room."
              />
            )
          }

          if (room.status === "running") { // TODO: add status "cancelled"
            return (
              // TODO: implement reconnection
              <>Session is running. Do you want to reconnect?</>
            )
          }

          return (
            <RoomStoreProvider
              initialRoom={room as WaitingRoomVariants}
              currentPlayerId={player.id}
            >
              <WaitingRoomScreen />
            </RoomStoreProvider>
          )
        }}
      </Await>
    </Suspense>
  )
}

export default WaitingRoomPage

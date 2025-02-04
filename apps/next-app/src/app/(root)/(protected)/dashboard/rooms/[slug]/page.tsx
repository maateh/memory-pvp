import { Suspense } from "react"

// types
import type { JoinedRoom, RunningRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"

// server
import { redis } from "@/server/redis"
import { getPlayer } from "@/server/db/query/player-query"

// config
import { roomKey } from "@repo/config/redis-keys"

// providers
import { RoomEventProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import WaitingRoomScreen from "./waiting-room-screen"

type WaitingRoomPageProps = {
  params: {
    slug: string
  }
}

const WaitingRoomPage = async ({ params }: WaitingRoomPageProps) => {
  const promises = Promise.all([
    redis.json.get<WaitingRoom | JoinedRoom | RunningRoom | SessionRoom>(roomKey(params.slug)),
    getPlayer({ filter: { isActive: true } })
  ])

  return (
    <Suspense fallback={<>Loading...</>}> {/* TODO: loading fallback */}
      <Await promise={promises}>
        {([room, player]) => room && player ? (
          <RoomEventProvider initialRoom={room} currentPlayerId={player.id}>
            {room.status === "finished" ? (
              <RedirectFallback
                redirect="/dashboard/rooms"
                type="replace"
                message="Session is finished."
                description="The session has already ended in this room."
              />
            ) : room.status === "running" ? ( // TODO: implement reconnection + add status "cancelled"
              <>Running session</>
            ) : <WaitingRoomScreen />}
          </RoomEventProvider>
        ) : (
          <RedirectFallback
            redirect="/dashboard/rooms"
            type="replace"
            message="Session room cannot be loaded."
            description="Unable to find this session room."
          >
            Loading... {/* TODO: loading fallback */}
          </RedirectFallback>
        )}
      </Await>
    </Suspense>
  )
}

export default WaitingRoomPage

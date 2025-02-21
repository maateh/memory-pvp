import { Suspense } from "react"
import dynamic from "next/dynamic"

// types
import type { WaitingRoomVariants } from "@repo/schema/room"

// redis
import { getActiveRoom } from "@repo/server/redis-commands"

// db
import { getPlayer } from "@/server/db/query/player-query"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/session/ingame"
import WaitingRoomScreen from "./waiting-room-screen"

// providers
const RoomStoreProvider = dynamic(() => import("@/components/provider/room-store-provider"), { ssr: false })

const WaitingRoomPage = async () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getPlayer({ filter: { isActive: true } })}>
        {(player) => player ? (
          <Await promise={getActiveRoom(player.id)}>
            {(room) => {
              if (!room) {
                return (
                  <RedirectFallback
                    redirect="/dashboard/rooms"
                    type="replace"
                    message="Room cannot be loaded."
                    description="Unable to find active session room."
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
        ) : (
          <RedirectFallback
            redirect="/dashboard/players"
            type="replace"
            message="Active player profile not found."
            description="Please create a player profile first."
          />
        )}
      </Await>
    </Suspense>
  )
}

export default WaitingRoomPage

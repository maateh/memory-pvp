import { Suspense } from "react"

// db
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getActiveRoom } from "@repo/server/redis-commands"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/gameplay"

// providers
import { RoomStoreProvider } from "@/components/provider"

const GameMultiplayerLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getPlayer({ isActive: true })}>
        {(player) => player ? (
          <Await promise={getActiveRoom(player.id)}>
            {(room) => room ? (
              <RoomStoreProvider
                initialRoom={room}
                currentPlayerId={player.id}
              >
                {children}
              </RoomStoreProvider>
            ) : (
              <RedirectFallback
                redirect="/game/setup"
                type="replace"
                message="Active game session not found."
                description="Create your own room or join another one first."
              />
            )}
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

export default GameMultiplayerLayout

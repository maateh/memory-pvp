import { Suspense } from "react"

// types
import type { RunningRoom } from "@repo/schema/room"

// db
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getActiveRoom } from "@repo/server/redis-commands"

// providers
import { MultiSessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/session/ingame"
import MultiGameHandler from "./multi-game-handler"

const MultiGamePage = async () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getPlayer({ filter: { isActive: true } })}>
        {(player) => player ? (
          <Await promise={getActiveRoom<RunningRoom>(player.id)}>
            {(room) => room ? (
              <MultiSessionStoreProvider
                initialSession={room.session}
              >
                <MultiGameHandler />
              </MultiSessionStoreProvider>
            ) : (
              <RedirectFallback
                redirect="/game/setup"
                type="replace"
                message="Active session or player profile cannot be loaded."
                description="Unable to find active session or your player profile."
              >
                <SessionLoader />
              </RedirectFallback>
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

export default MultiGamePage

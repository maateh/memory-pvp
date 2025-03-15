import { Suspense } from "react"

// db
import { getPlayer } from "@/server/db/query/player-query"
import { getActiveClientSession } from "@/server/db/query/session-query"

// providers
import { SessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/gameplay"
import SingleGameHandler from "./single-game-handler"

const SingleGamePage = () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getPlayer({ isActive: true })}>
        {(player) => player ? (
          <Await promise={getActiveClientSession("SOLO", player.id)}>
            {(session) => session ? (
              <SessionStoreProvider
                currentPlayer={player}
                initialSession={session}
              >
                <SingleGameHandler />
              </SessionStoreProvider>
            ) : (
              <RedirectFallback
                redirect="/game/setup"
                type="replace"
                message="Active session cannot be loaded."
                description="Unable to find active session."
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

export default SingleGamePage

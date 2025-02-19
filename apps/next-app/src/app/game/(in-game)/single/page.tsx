import { Suspense } from "react"

// db
import { getActiveClientSession } from "@/server/db/query/session-query"

// providers
import { SingleSessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/session/ingame"
import SingleGameHandler from "./single-game-handler"

const SingleGamePage = () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getActiveClientSession()}>
        {(session) => session ? (
          <SingleSessionStoreProvider initialSession={session}>
            <SingleGameHandler />
          </SingleSessionStoreProvider>
        ) : (
          <RedirectFallback
            redirect="/game/setup"
            type="replace"
            message="Active session cannot be loaded."
            description="Unable to find active session."
          >
            <SessionLoader />
          </RedirectFallback>
        )}
      </Await>
    </Suspense>
  )
}

export default SingleGamePage

import { Suspense } from "react"

// actions
import { getActiveSession } from "@/server/action/session-action"

// providers
import { SingleSessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/session/ingame"
import SingleGameHandler from "./single-game-handler"

const SingleGamePage = () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getActiveSession()}>
        {(session) => session?.data ? (
          <SingleSessionStoreProvider initialSession={session.data}>
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

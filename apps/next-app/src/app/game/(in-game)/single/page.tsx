import { Suspense } from "react"

// actions
import { getActiveSession } from "@/server/action/session-action"

// providers
import { SingleSessionStoreProvider } from "@/components/provider"

// components
import { SessionFooter, SessionHeader, SessionLoader } from "@/components/session/ingame"
import { Await, RedirectFallback } from "@/components/shared"
import SingleGameHandler from "./single-game-handler"

const SingleGamePage = () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getActiveSession()}>
        {(session) => session?.data ? (
          <SingleSessionStoreProvider session={session.data}>
            <SessionHeader />

            <SingleGameHandler />

            <SessionFooter />
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

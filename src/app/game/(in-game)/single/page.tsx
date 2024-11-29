import { Suspense } from "react"

// actions
import { getActiveSession } from "@/server/actions/session"

// providers
import { SessionStoreProvider } from "@/components/providers"

// components
import { SessionFooter, SessionHeader, SessionLoader } from "@/components/session/ingame"
import { Await } from "@/components/shared"
import SingleGameHandler from "./single-game-handler"

const SingleGamePage = () => {
  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={getActiveSession()}>
        {(session) => session?.data ? (
          <SessionStoreProvider session={session.data}>
            <SessionHeader session={session.data} />

            <SingleGameHandler />

            <SessionFooter />
          </SessionStoreProvider>
        ) : <>TODO: not found fallback</>}
      </Await>
    </Suspense>
  )
}

export default SingleGamePage

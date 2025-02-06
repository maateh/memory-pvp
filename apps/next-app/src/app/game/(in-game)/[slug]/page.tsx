import { Suspense } from "react"

// types
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@/lib/types/prisma"

// server
import { redis } from "@/server/redis"
import { getPlayer } from "@/server/db/query/player-query"

// config
import { roomKey } from "@repo/config/redis-keys"

// utils
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

// providers
import { MultiSessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionFooter, SessionHeader, SessionLoader } from "@/components/session/ingame"
import MultiGameHandler from "./multi-game-handler"

type MultiGamePageProps = {
  params: {
    slug: string
  }
}

const MultiGamePage = async ({ params }: MultiGamePageProps) => {
  const promises = Promise.all([
    redis.json.get<GameSessionWithPlayersWithAvatarWithCollectionWithCards[]>(
      roomKey(params.slug),
      "$.session"
    ),
    getPlayer({ filter: { isActive: true } })
  ])

  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={promises}>
        {([session, player]) => session && session.length && player ? (
          <MultiSessionStoreProvider
            initialSession={parseSchemaToClientSession(session[0])}
            currentPlayer={player}
          >
            <SessionHeader />
            <MultiGameHandler />
            <SessionFooter />
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
    </Suspense>
  )
}

export default MultiGamePage

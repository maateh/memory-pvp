import { Suspense } from "react"

// types
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@/lib/types/prisma"

// db
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"

// utils
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

// providers
import { MultiSessionStoreProvider } from "@/components/provider"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionLoader } from "@/components/session/ingame"
import MultiGameHandler from "./multi-game-handler"

type MultiGamePageProps = {
  params: {
    slug: string
  }
}

const MultiGamePage = async ({ params }: MultiGamePageProps) => {
  const promise = Promise.all([
    redis.json.get<GameSessionWithPlayersWithAvatarWithCollectionWithCards[]>(
      roomKey(params.slug),
      "$.session"
    ),
    getPlayer({ filter: { isActive: true }})
  ])

  return (
    <Suspense fallback={<SessionLoader />}>
      <Await promise={promise}>
        {([sessions, player]) => sessions && sessions.length && player ? (
          <MultiSessionStoreProvider
            initialSession={parseSchemaToClientSession(sessions[0], player.id)}
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
    </Suspense>
  )
}

export default MultiGamePage

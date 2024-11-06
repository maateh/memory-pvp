import dynamic from "next/dynamic"

// server
import { getClientSession } from "@/server/db/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionStatistics, SessionStatisticsSkeleton } from "@/components/session/summary"
import SessionPlayerStats from "./session-player-stats"

const SessionNotFound = dynamic(() => import('./session-not-found'), {
  ssr: false,
  loading: SessionStatisticsSkeleton
})

type SessionSummaryPageProps = {
  params: {
    slug: string
  }
}

const SessionSummaryPage = async ({ params }: SessionSummaryPageProps) => {
  const clientSession = await getClientSession({ slug: params.slug })

  if (!clientSession) {
    return <SessionNotFound />
  }

  const stats = getSessionStatsMap(clientSession)

  return (
    <>
     <SessionStatistics
        stats={stats}
      />

      <Separator className="w-2/5 mx-auto mt-8 mb-12 bg-border/10" />

      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
        <SessionPlayerStats
          player={clientSession.players.current}
          session={clientSession}
        />

        {clientSession.players.current && (
          <SessionPlayerStats
            player={clientSession.players.current}
            session={clientSession}
          />
        )}
      </div>
    </>
  )
}

export default SessionSummaryPage

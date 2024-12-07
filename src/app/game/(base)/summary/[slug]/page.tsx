import dynamic from "next/dynamic"

// server
import { getClientSession } from "@/server/db/session"

// utils
import { getRendererSessionStats } from "@/lib/utils/stats"
import { cn } from "@/lib/utils"

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

  const stats = getRendererSessionStats(clientSession)

  return (
    <>
     <SessionStatistics stats={stats} />

      <Separator className="w-2/5 mx-auto mt-8 mb-12 bg-border/10" />

      <div className={cn("mx-auto grid gap-x-16 gap-y-12", {
        "lg:grid-cols-2": !!clientSession.players.other
      })}>
        <SessionPlayerStats
          player={clientSession.players.current}
          session={clientSession}
        />

        {clientSession.players.other && (
          <SessionPlayerStats
            player={clientSession.players.other}
            session={clientSession}
          />
        )}
      </div>
    </>
  )
}

export default SessionSummaryPage

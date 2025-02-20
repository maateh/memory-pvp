import dynamic from "next/dynamic"

// server
import { getClientSession } from "@/server/db/query/session-query"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

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

  return (
    <>
      <SessionStatistics stats={getRendererSessionStats(clientSession)} />

      <Separator className="w-2/5 mx-auto mt-8 mb-12 bg-border/10" />

      <div className={cn("mx-auto grid gap-x-16 gap-y-12", {
        "lg:grid-cols-2": clientSession.mode !== "SINGLE"
      })}>
        <SessionPlayerStats
          player={clientSession.owner}
          session={clientSession}
        />

        {clientSession.mode !== "SINGLE" && (
          <SessionPlayerStats
            player={clientSession.guest}
            session={clientSession}
          />
        )}
      </div>
    </>
  )
}

export default SessionSummaryPage

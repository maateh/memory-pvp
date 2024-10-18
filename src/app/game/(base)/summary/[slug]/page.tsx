import dynamic from "next/dynamic"

// server
import { getClientSession } from "@/server/actions/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionStatistics, SessionStatisticsSkeleton } from "@/components/session/summary"

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

  // TODO: implement UI
  // - show player stats
  // - option to go back `/game/setup`
  return (
    <>
     <SessionStatistics
        stats={stats}
      />

      <Separator className="w-2/5 mx-auto mt-6 mb-8 bg-border/10" />
    </>
  )
}

export default SessionSummaryPage

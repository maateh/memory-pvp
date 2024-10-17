// server
import { getClientSession } from "@/server/actions/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionStatistics } from "@/components/session/summary"

type SessionSummaryPageProps = {
  params: {
    slug: string
  }
}

const SessionSummaryPage = async ({ params }: SessionSummaryPageProps) => {
  const clientSession = await getClientSession({ slug: params.slug })

  if (!clientSession) {
    // TODO: show session not found or access denied layout
    return null
  }

  const stats = getSessionStatsMap(clientSession)

  return (
    <SessionStatistics
      stats={stats}
    />
  )
}

export default SessionSummaryPage

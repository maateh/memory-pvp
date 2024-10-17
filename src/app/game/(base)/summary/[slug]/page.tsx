// server
import { getClientSession } from "@/server/actions/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

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
    <>
      <StatisticList className="px-2 max-w-4xl">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="min-w-40 max-w-60 sm:min-w-60"
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>
    </>
  )
}

export default SessionSummaryPage

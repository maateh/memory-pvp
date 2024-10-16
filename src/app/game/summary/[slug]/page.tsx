// server
import { getClientSession } from "@/server/actions/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

type GameSessionSummaryProps = {
  params: {
    slug: string
  }
}

const GameSessionSummary = async ({ params }: GameSessionSummaryProps) => {
  const clientSession = await getClientSession({ slug: params.slug })

  if (!clientSession) {
    // TODO: show session not found or access denied layout
    return null
  }

  const stats = getSessionStatsMap(clientSession)

  return (
    <main className="flex-1 px-2.5 sm:px-4">
      <header className="mt-24 mb-12">
        <h1 className="mt-24 pt-1.5 w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Session Results
        </h1>

        <Separator className="w-5/6 mx-auto my-3 border-foreground/50" />
      </header>

      <StatisticList className="px-2 max-w-4xl">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="min-w-40 max-w-60 sm:min-w-60"
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>
    </main>
  )
}

export default GameSessionSummary

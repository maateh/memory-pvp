// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

type SessionStatisticsProps = {
  stats: RendererStatsMap<RendererSessionStatKeys>
}

const SessionStatistics = ({ stats }: SessionStatisticsProps) => {
  return (
    <>
      <h2 className="text-foreground/90 text-2xl text-center font-heading font-medium sm:text-3xl">
        Statistics
      </h2>

      <Separator className="w-1/3 h-1 mx-auto mt-0.5 mb-2.5 bg-accent/25 rounded-full" />

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

const SessionStatisticsSkeleton = () => {
  return (
    <>
      <h2 className="text-foreground/90 text-2xl text-center font-heading font-medium sm:text-3xl">
        Statistics
      </h2>

      <Separator className="w-1/3 h-1 mx-auto mt-0.5 mb-2.5 bg-accent/25 rounded-full" />

      <StatisticList className="w-full px-2 max-w-4xl">
        {Array(5).fill('').map((_, index) => (
          <li key={index}>
            <Skeleton className="bg-secondary/30 border border-border/35 rounded-xl h-12 sm:h-16 min-w-40 max-w-60 sm:min-w-60" />
          </li>
        ))}
      </StatisticList>
    </>
  )
}

export default SessionStatistics
export { SessionStatisticsSkeleton }

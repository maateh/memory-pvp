import { Suspense } from "react"

// db
import { getResults } from "@/server/db/query/result-query"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// components
import {
  Await,
  RedirectFallback,
  StatisticItem,
  StatisticList,
  StatisticListSkeleton
} from "@/components/shared"
import SessionPlayerResult from "./session-player-result"

type GameSummaryPageProps = {
  params: Promise<{ slug: string }>
}

const GameSummaryPage = async ({ params }: GameSummaryPageProps) => {
  const { slug } = await params

  return (
    <Suspense fallback={<StatisticListSkeleton />}>
      <Await promise={getResults(slug)}>
        {(results) => results.length > 0 ? (
          <div className="flex flex-col">
            <StatisticList className="px-2 max-w-4xl">
              {Object.values(getRendererSessionStats(results[0].session)).map((stat) => (
                <StatisticItem className="min-w-36 max-w-52 sm:min-w-52"
                  dataProps={{ className: cn({ "text-xs": stat.key === "startedAt" }) }}
                  statistic={stat}
                  key={stat.key}
                />
              ))}
            </StatisticList>

            <div className={cn("mt-12 sm:mt-16 mx-auto grid gap-x-16 gap-y-10", {
              "lg:grid-cols-2": results[0].session.format === "PVP" || results[0].session.format === "COOP"
            })}>
              {results.map((result) => (
                <SessionPlayerResult
                  result={result}
                  key={result.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <RedirectFallback
            redirect="/game/setup"
            type="replace"
            message="Session results not found."
            description="Results cannot be found for this session or you don't have access to it."
          />
        )}
      </Await>
    </Suspense>
  )
}

export default GameSummaryPage

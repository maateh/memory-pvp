import { Suspense } from "react"

// db
import { getResults } from "@/server/db/query/result-query"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionStatistics, SessionStatisticsSkeleton } from "@/components/session/summary"
import SessionPlayerResult from "./session-player-result"

type SessionSummaryPageProps = {
  params: Promise<{ slug: string }>
}

const SessionSummaryPage = async ({ params }: SessionSummaryPageProps) => {
  const { slug } = await params

  return (
    <Suspense fallback={<SessionStatisticsSkeleton />}>
      <Await promise={getResults(slug)}>
        {(results) => results.length > 0 ? (
          <>
            <SessionStatistics stats={getRendererSessionStats(results[0].session)} />

            <Separator className="w-2/5 mx-auto mt-8 mb-12 bg-border/10" />

            <div className={cn("mx-auto grid gap-x-16 gap-y-12", {
              "lg:grid-cols-2": results[0].session.format === "PVP" || results[0].session.format === "COOP"
            })}>
              {results.map((result) => (
                <SessionPlayerResult
                  result={result}
                  key={result.id}
                />
              ))}
            </div>
          </>
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

export default SessionSummaryPage

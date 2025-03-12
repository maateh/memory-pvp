import { Suspense } from "react"

// db
import { getClientSession } from "@/server/db/query/session-query"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, RedirectFallback } from "@/components/shared"
import { SessionStatistics, SessionStatisticsSkeleton } from "@/components/session/summary"
import SessionPlayerStats from "./session-player-stats"

type SessionSummaryPageProps = {
  params: {
    slug: string
  }
}

const SessionSummaryPage = async ({ params }: SessionSummaryPageProps) => {
  return (
    <Suspense fallback={<SessionStatisticsSkeleton />}>
      <Await promise={getClientSession({ slug: params.slug })}>
        {(session) => session ? (
          <>
            <SessionStatistics stats={getRendererSessionStats(session)} />

            <Separator className="w-2/5 mx-auto mt-8 mb-12 bg-border/10" />

            <div className={cn("mx-auto grid gap-x-16 gap-y-12", {
              "lg:grid-cols-2": session.format === "PVP" || session.format === "COOP"
            })}>
              <SessionPlayerStats
                player={session.owner}
                session={session}
              />

              {(session.format === "PVP" || session.format === "COOP") && (
                <SessionPlayerStats
                  player={session.guest}
                  session={session}
                />
              )}
            </div>
          </>
        ) : (
          <RedirectFallback
            redirect="/game/setup"
            type="replace"
            message="Session not found."
            description="Sorry, but the session cannot be found or you don't have access to it."
          />
        )}
      </Await>
    </Suspense>
  )
}

export default SessionSummaryPage

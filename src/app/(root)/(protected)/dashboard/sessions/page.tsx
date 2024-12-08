import { Suspense } from "react"

// types
import type { SessionFilter, SessionSort } from "@/components/session/filter/types"

// server
import { getClientSessions } from "@/server/db/query/session-query"

// utils
import { parseFilterParams } from "@/lib/util/parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCardList, SessionCardListSkeleton } from "@/components/session/card"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { Await } from "@/components/shared"
import SessionsTable from "./sessions-table"

type SessionsPageProps = {
  searchParams: SessionFilter & SessionSort
}

const SessionsPage = async ({ searchParams }: SessionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort, pagination } = parseFilterParams<typeof searchParams>(params)

  return (
    <div className="page-wrapper">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Separator className="w-1.5 h-5 sm:h-6 bg-accent rounded-full" />

          <h3 className="mt-1 text-lg font-heading tracking-wide sm:text-xl">
            Session settings
          </h3>
        </div>

        <SessionStatusFilter filterKey="history" />
        <SessionSettingsFilter filterKey="history" />
      </div>

      <Separator className="h-0.5 my-5 bg-border/30 rounded-full" />

      <Suspense fallback={<SessionCardListSkeleton />}>
        <Await promise={getClientSessions({ filter, sort, pagination })}>
          {({ data: sessions }) => (
            <>
              <div className="block xl:hidden">
                <SessionCardList sessions={sessions} />
              </div>

              <div className="hidden xl:block">
                <SessionsTable sessions={sessions} />
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default SessionsPage

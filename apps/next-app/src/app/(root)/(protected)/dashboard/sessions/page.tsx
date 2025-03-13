import { Suspense } from "react"

// types
import type { SessionFilter, SessionSort } from "@repo/schema/session"

// server
import { getClientSessions } from "@/server/db/query/session-query"

// config
import { sessionSortOptions } from "@/components/session/filter/constants"

// utils
import { parseFilterParams } from "@/lib/util/parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { SessionListing, SessionListingSkeleton } from "@/components/session/listing"
import { Await, PaginationHandler, SortDropdownButton } from "@/components/shared"

type SessionsPageProps = {
  searchParams: SessionFilter & SessionSort
}

const SessionsPage = ({ searchParams }: SessionsPageProps) => {
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
        <div className="flex items-center gap-x-2">
          <SortDropdownButton options={sessionSortOptions} />
          <SessionSettingsFilter filterKey="history" />
        </div>
      </div>

      <Separator className="h-0.5 my-5 bg-border/30 rounded-full" />

      <Suspense fallback={<SessionListingSkeleton />}>
        <Await promise={getClientSessions({ filter, sort, pagination })}>
          {({ data: sessions, ...pagination }) => (
            <>
              <SessionListing sessions={sessions} />

              <PaginationHandler className="py-5"
                pathname="/dashboard/sessions"
                searchParams={searchParams as {}}
                pagination={pagination}
              />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default SessionsPage

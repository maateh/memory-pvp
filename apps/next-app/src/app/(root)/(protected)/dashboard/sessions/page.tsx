import { Suspense } from "react"

// types
import type { SessionFilter, SessionSort } from "@repo/schema/session"

// schemas
import { sessionFilter, sessionSort } from "@repo/schema/session"

// server
import { getClientSessions } from "@/server/db/query/session-query"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, PaginationHandler, SortDropdownButton } from "@/components/shared"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { SessionListing, SessionListingSkeleton } from "@/components/session/listing"

type SessionsPageProps = {
  searchParams: SessionFilter & SessionSort
}

const SessionsPage = async (props: SessionsPageProps) => {
  const searchParams = await props.searchParams;
  const searchEntries = new URLSearchParams(searchParams as {}).entries()
  const { filter, sort, pagination } = parseSearchParams(searchEntries, {
    filterSchema: sessionFilter,
    sortSchema: sessionSort,
    parsePagination: true
  })

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
          <SortDropdownButton schemaKey="session" />

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

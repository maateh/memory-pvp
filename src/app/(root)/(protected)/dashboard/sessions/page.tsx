// types
import type { SessionFilter, SessionSort } from "@/components/session/filter/types"

// server
import { getClientSessions } from "@/server/db/session"

// utils
import { parseFilterParams } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCardList } from "@/components/session/card"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import SessionsTable from "./sessions-table"

type SessionsPageProps = {
  searchParams: SessionFilter & SessionSort
}

const SessionsPage = async ({ searchParams }: SessionsPageProps) => {
  const params = new URLSearchParams(searchParams)
  const { filter, sort } = parseFilterParams<typeof searchParams>(params) as {
    filter: SessionFilter
    sort: SessionSort
  }

  const sessions = await getClientSessions({ filter, sort })

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

      <SessionCardList className="block xl:hidden"
        sessions={sessions}
      />

      <div className="hidden xl:block">
        <SessionsTable sessions={sessions} />
      </div>
    </div>
  )
}

export default SessionsPage

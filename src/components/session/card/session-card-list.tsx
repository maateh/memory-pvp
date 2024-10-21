"use client"

// types
import type { SessionSettingsFilter } from "@/components/session/filter/session-settings-filter"
import type { SessionStatusFilter } from "@/components/session/filter/session-status-filter"
import type { SessionSort } from "@/components/session/filter/session-sort"

// trpc
import { api } from "@/trpc/client"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"

// components
import { CardItem, Warning } from "@/components/shared"
import { SessionCard, SessionCardSkeleton } from "@/components/session/card"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

type SessionFilter = SessionSettingsFilter & SessionStatusFilter

const SessionCardList = () => {
  const filter = useFilterStore<SessionFilter>(({ history }) => history.filter)
  const sort = useFilterStore<SessionSort>(({ history }) => history.sort)

  const { data: sessions, isFetching } = api.session.get.useQuery({ filter, sort })

  if (!sessions || isFetching) {
    return (
      <ul className="space-y-3">
        {Array(3).fill('').map((_, index) => (
          <CardItem key={index}>
            <SessionCardSkeleton />
          </CardItem>
        ))}
      </ul>
    )
  }

  if (sessions.length === 0) {
    const message = filter
      ? "Couldn't find game session with the specified filter."
      : "You have no game session history yet."

    return (
      <CardItem className="py-3.5 justify-center">
        <Warning message={message} />
      </CardItem>
    )
  }

  return (
    <ScrollArea className="max-h-60 pr-3">
      <ul className="space-y-3">
        {sessions.map((session) => (
          <CardItem className="rounded-2xl" key={session.slug}>
            <SessionCard session={session} />
          </CardItem>
        ))}
      </ul>
    </ScrollArea>
  )
}

export default SessionCardList

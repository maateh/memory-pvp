"use client"

// types
import type { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter/types"

// trpc
import { api } from "@/trpc/client"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"

// components
import { CardItem, Warning } from "@/components/shared"
import { SessionCard, SessionCardSkeleton } from "@/components/session/card"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

type SessionFilter = SessionSettingsFilter & SessionStatusFilter

// TODO: move to SSR
const SessionCardList = () => {
  const { filter, sort } = useFilterParams<SessionFilter>()

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

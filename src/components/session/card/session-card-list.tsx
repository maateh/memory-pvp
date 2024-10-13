"use client"

// types
import type { SessionFilterFields } from "@/components/session/filter/types"

// trpc
import { api } from "@/trpc/client"

// icons
import { Loader2 } from "lucide-react"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"

// components
import { CardItem } from "@/components/shared"
import { SessionCard } from "@/components/session/card"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

const SessionCardList = () => {
  const filter = useFilterStore<SessionFilterFields, 'filter'>((state) => state.filter)

  const { data: sessions, isFetching } = api.session.get.useQuery(filter)

  if (!sessions || isFetching) {
    // TODO: add skeleton instead of loader icon
    return (
      <Loader2 className="mx-auto mt-6 mb-2 size-5 sm:size-6 text-muted-foreground animate-spin"
        strokeWidth={3.5}
      />
    )
  }

  // TODO: create UI
  if (sessions.length === 0) {
    return <>no data</>
  }

  return (
    <ScrollArea className="max-h-60 pr-3">
      <ul className="flex flex-col gap-y-1">
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

"use client"

import { useEffect } from "react"

// types
import type { GameSession } from "@prisma/client"
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

type SessionCardListProps = {
  initialData: Omit<GameSession, 'id'>[]
}

const SessionCardList = ({ initialData }: SessionCardListProps) => {
  const filter = useFilterStore<SessionFilterFields, 'filter'>((state) => state.filter)

  const apiUtils = api.useUtils()

  const { data: sessions, isFetching } = api.session.get.useQuery(filter, {
    initialData,
    refetchOnMount: true
  })

  useEffect(() => {
    apiUtils.session.get.invalidate()
  }, [filter, apiUtils.session.get])

  if (isFetching) {
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
        {sessions?.map((session) => (
          <CardItem className="rounded-2xl" key={session.slug}>
            <SessionCard session={session} />
          </CardItem>
        ))}
      </ul>
    </ScrollArea>
  )
}

export default SessionCardList

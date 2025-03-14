"use client"

// types
import type { SessionFilter } from "@repo/schema/session"

// trpc
import { trpc } from "@/server/trpc/client"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

const SessionCount = ({ playerId }: { playerId: string }) => {
  const filter = useFilterStore<SessionFilter>((state) => state.history)
  const [sessionCount] = trpc.session.count.useSuspenseQuery({
    filter: { ...filter, playerId }
  })

  return (
    <>
      <span className="text-accent font-semibold">
        {sessionCount}
      </span> total
    </>
  )
}

export default SessionCount

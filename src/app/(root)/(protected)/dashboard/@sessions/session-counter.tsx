"use client"

// trpc
import { api } from "@/trpc/client"

// types
import type { SessionSettingsFilter } from "@/components/session/filter/session-settings-filter"

// icons
import { Loader2, SquareSigma } from "lucide-react"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

const SessionCounter = () => {
  const filter = useFilterStore<SessionSettingsFilter>(({ session }) => session.filter)

  const { data: amount, isFetching } = api.session.count.useQuery(filter)

  return (
    <div className="mt-5 pt-2.5 flex gap-x-2 border-t border-border/70">
      <SquareSigma className="size-4 sm:size-5" />
      <p className="flex items-center gap-x-1.5 font-heading small-caps">
        Total sessions:

        {!isFetching ? (
          <span className="font-medium">
            {amount}
          </span>
        ) : (
          <Loader2 className="size-3.5 text-muted-foreground animate-spin"
            strokeWidth={4}
          />
        )}
      </p>
    </div>
  )
}

export default SessionCounter

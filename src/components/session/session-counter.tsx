"use client"

// types
import type { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter/types"

// trpc
import { api } from "@/trpc/client"

// icons
import { Loader2, SquareSigma } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Warning } from "@/components/shared"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

type SessionFilter = SessionSettingsFilter & SessionStatusFilter

type SessionCounterProps = {
  player: Pick<ClientPlayer, 'id' | 'tag'> | null
}

const SessionCounter = ({ player }: SessionCounterProps) => {
  const filter = useFilterStore<SessionFilter>((state) => state.history)

  const { data: amount, isFetching } = api.session.count.useQuery({ ...filter, playerId: player?.id })

  if (!player) {
    return (
      <div className="mt-5 pt-2.5 border-t border-border/70">
        <Warning className="w-fit font-heading"
          messageProps={{ className: "mt-0.5" }}
          iconProps={{ className: "size-4" }}
          message="You have played 0 sessions."
        />
      </div>
    )
  }

  return (
    <div className="mt-5 pt-2.5 flex gap-x-2 border-t border-border/70">
      <SquareSigma className="size-4 sm:size-5 flex-none" />

      <div className="flex items-center gap-x-1.5 font-heading dark:font-light">
        <span className="text-accent font-medium dark:font-normal">
          {player.tag}&apos;s  
        </span> sessions

        <Separator className="w-1 h-3 bg-border/50 rounded-full" />

        {!isFetching ? (
          <>
            <span className="text-accent font-semibold">
              {amount}
            </span> total
          </>
        ) : (
          <Loader2 className="size-3.5 text-muted-foreground animate-spin"
            strokeWidth={4}
          />
        )}
      </div>
    </div>
  )
}

export default SessionCounter

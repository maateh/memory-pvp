"use server"

import { Suspense } from "react"

// server
import { getPlayer } from "@/server/db/query/player-query"

// trpc
import { trpc, HydrateClient } from "@/server/trpc/server"

// icons
import { Loader2, SquareSigma } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCount } from "@/components/session"
import { Warning } from "@/components/shared"

const SessionCounter = async () => {
  const player = await getPlayer({ filter: { isActive: true } })

  if (!player) {
    return (
      <Warning className="w-full mt-5 pt-2.5 justify-start border-t border-border/50 font-heading"
        messageProps={{ className: "mt-1" }}
        iconProps={{ className: "size-4" }}
        message="You have played 0 sessions."
      />
    )
  }

  void trpc.session.count.prefetch({})

  return (
    <div className="mt-5 pt-3 flex gap-x-2 border-t border-border/50">
      <SquareSigma className="size-4 sm:size-5 shrink-0" />

      <div className="flex items-center gap-x-1.5 font-heading dark:font-light">
        <span className="text-accent font-medium dark:font-normal">
          {player.tag}&apos;s
        </span> sessions

        <Separator className="w-1 h-3 mx-0.5 bg-border/50 rounded-full" />

        <HydrateClient>
          <Suspense fallback={<Loader2 className="size-3.5 shrink-0 text-muted-foreground animate-spin" strokeWidth={4} />}>
            <SessionCount />
          </Suspense>
        </HydrateClient>
      </div>
    </div>
  )
}

export default SessionCounter

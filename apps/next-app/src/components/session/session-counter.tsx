"use server"

import { Suspense } from "react"

// types
import type { ClientPlayer } from "@/lib/schema/player-schema"

// trpc
import { trpc, HydrateClient } from "@/server/trpc/server"

// icons
import { Loader2, SquareSigma } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCount } from "@/components/session"

const SessionCounter = ({ player }: { player: ClientPlayer }) => {
  void trpc.session.count.prefetch({ playerId: player.id })

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
            <SessionCount playerId={player.id} />
          </Suspense>
        </HydrateClient>
      </div>
    </div>
  )
}

export default SessionCounter

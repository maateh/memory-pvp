"use server"

import { Suspense } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"

// trpc
import { HydrateClient, trpc } from "@/server/trpc/server"

// icons
import { Hash } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerStatsRenderer, PlayerStatsRendererSkeleton, PlayerVerified } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

type PlayerProfileCardProps = {
  player: ClientPlayer
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  void trpc.player.getStats.prefetch({ playerId: player.id })

  return (
    <>
      <div className="py-1 flex gap-x-3 items-center">
        <Hash className="size-4 shrink-0 border border-border/5"
          style={{ color: player.color }}
          strokeWidth={2.5}
        />
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <Separator className="w-1 h-4 rounded-full"
              style={{ backgroundColor: player.color }}
            />

            <p className="font-heading font-semibold">
              {player.tag}
            </p>

            {player.isActive && <PlayerVerified showTooltip />}
          </div>

          <HydrateClient>
            <Suspense fallback={<PlayerStatsRendererSkeleton />}>
              <PlayerStatsRenderer player={player} />
            </Suspense>
          </HydrateClient>
        </div>
      </div>

      <PlayerActionsDropdown className="ml-2.5 sm:ml-6 flex items-center gap-x-2.5"
        player={player}
      />
    </>
  )
}

export default PlayerProfileCard

import { Suspense } from "react"

// server
import { getPlayers } from "@/server/db/query/player-query"

// types
import type { PlayerFilter, PlayerSort } from "@repo/schema/player"

import { playerFilter, playerSort } from "@repo/schema/player"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, SortDropdownButton } from "@/components/shared"
import { PlayerProfileListing, PlayerProfileListingSkeleton } from "@/components/player/listing"
import { PlayerTagFilter } from "@/components/player/filter"
import { PlayerCreateWidgetCard } from "@/components/player/widget"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"

type PlayersPageProps = {
  searchParams: PlayerFilter & PlayerSort
}

const PlayersPage = async (props: PlayersPageProps) => {
  const searchParams = await props.searchParams;
  const searchEntries = new URLSearchParams(searchParams as {}).entries()
  const { filter, sort } = parseSearchParams(searchEntries, {
    filterSchema: playerFilter,
    sortSchema: playerSort
  })

  return (
    <div className="page-wrapper relative flex flex-col gap-10 xl:flex-row">
      <div className="flex-1 w-full xl:max-w-screen-sm xl:order-2">
        <PlayerCreateWidgetCard />
      </div>

      <div className="flex-1 w-full">
        <div className="flex items-end justify-between gap-x-6">
          <PlayerTagFilter className="flex-1" />
          <SortDropdownButton schemaKey="player" />
        </div>

        <Separator className="w-2/3 mx-auto my-4 bg-border/10 rounded-full" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-x-2">
            <Separator className="w-1.5 h-5 bg-accent rounded-full" />
            <h3 className="mt-1 text-base font-heading tracking-wide sm:text-lg">
              Statistics filter
            </h3>
          </div>

          <SessionStatusFilter
            filterService="store"
            filterKey="statistics"
          />

          <SessionSettingsFilter
            filterService="store"
            filterKey="statistics"
          />
        </div>

        <Separator className="my-5 bg-border/20 rounded-full" />

        <Suspense fallback={<PlayerProfileListingSkeleton />}>
          <Await promise={getPlayers({ filter, sort })}>
            {(players) => <PlayerProfileListing players={players} />}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}

export default PlayersPage

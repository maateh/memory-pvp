// types
import type { PlayerFilter, PlayerSort } from "@/components/player/filter/types"

// constants
import { playerSortOptions } from "@/components/player/filter/constants"

// utils
import { parseFilterParams } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileCardList } from "@/components/player/card"
import { PlayerTagFilter } from "@/components/player/filter"
import { PlayerCreateWidgetCard } from "@/components/player/widget"
import { SortDropdownButton } from "@/components/shared"

type PlayersPageProps = {
  searchParams: PlayerFilter & PlayerSort
}

const PlayersPage = ({ searchParams }: PlayersPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  return (
    <div className="page-wrapper relative grid grid-cols-9 gap-10">
      <div className="w-full h-fit mx-auto col-span-9 xl:order-2 xl:col-span-4 xl:sticky xl:top-8">
        <PlayerCreateWidgetCard />
      </div>

      <div className="w-full col-span-9 xl:col-span-5">
        <div className="flex items-end justify-between gap-x-6">
          <PlayerTagFilter className="flex-1" />
          <SortDropdownButton options={playerSortOptions} />
        </div>

        <Separator className="my-5 bg-border/20 rounded-full" />

        <PlayerProfileCardList
          filter={filter}
          sort={sort}
        />
      </div>
    </div>
  )
}

export default PlayersPage

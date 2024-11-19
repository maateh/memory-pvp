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
    <div className="page-wrapper relative flex flex-col gap-10 xl:flex-row">
      <div className="flex-1 w-full xl:max-w-screen-sm xl:order-2">
        <PlayerCreateWidgetCard />
      </div>

      <div className="flex-1 w-full">
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

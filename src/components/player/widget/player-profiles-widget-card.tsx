// server
import { getPlayer } from "@/server/db/query/player-query"

// icons
import { Gamepad2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileCard } from "@/components/player/card"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetQuickAccess,
  WidgetSubtitle
} from "@/components/widget"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { CardItem, Warning } from "@/components/shared"

const PlayerProfilesWidgetCard = async () => {
  const activePlayer = await getPlayer({ filter: { isActive: true } })

  return (
    <WidgetCard
      title="Player Profiles"
      description="Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
      Icon={Gamepad2}
    >
      <WidgetActionWrapper>
        <WidgetQuickAccess href="/players/select" />

        <WidgetLink href="/dashboard/players" />
      </WidgetActionWrapper>

      <div className="space-y-1.5">
        <WidgetSubtitle>
          Statistics filter
        </WidgetSubtitle>

        <SessionStatusFilter
          filterService="store"
          filterKey="statistics"
        />

        <SessionSettingsFilter
          filterService="store"
          filterKey="statistics"
        />
      </div>

      <Separator className="w-1/2 mx-auto mt-4 mb-2 bg-border/10" />

      {activePlayer ? (
        <CardItem>
          <PlayerProfileCard player={activePlayer} />
        </CardItem>
      ) : (
        <CardItem className="justify-center">
          <Warning message="Currently, you don't have any player profile." />
        </CardItem>
      )}
    </WidgetCard>
  )
}

export default PlayerProfilesWidgetCard

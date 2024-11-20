// server
import { getPlayers } from "@/server/db/player"

// icons
import { Gamepad2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileCard } from "@/components/player/card"
import { PlayerSelectDrawer } from "@/components/player/select"
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
  const players = await getPlayers()
  const activePlayer = players.find((player) => player.isActive)

  return (
    <WidgetCard
      title="Player Profiles"
      description="Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
      Icon={Gamepad2}
    >
      <WidgetActionWrapper>
        <PlayerSelectDrawer players={players} asChild>
          <WidgetQuickAccess />
        </PlayerSelectDrawer>

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

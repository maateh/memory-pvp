// server
import { getPlayers } from "@/server/db/player"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { CardItem, Warning } from "@/components/shared"
import { PlayerProfileCard } from "@/components/player/card"
import { PlayerSelectDrawer } from "@/components/player/select"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetQuickAccess,
  WidgetSubtitle
} from "@/components/widget"

const PlayerProfilesWidgetCard = async () => {
  const players = await getPlayers(true)
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

      <WidgetSubtitle>
        Active player profile
      </WidgetSubtitle>

      {activePlayer ? (
        <CardItem>
          <PlayerProfileCard player={activePlayer} />
        </CardItem>
      ) : (
        <Warning message="Currently, you don't have any player profile." />
      )}
    </WidgetCard>
  )
}

export default PlayerProfilesWidgetCard

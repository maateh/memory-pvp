// server
import { getPlayer } from "@/server/db/player"

// constants
import { playerProfilesWidgetInfo } from "@/components/widgets/constants"

// components
import { WidgetCard, WidgetSubheader } from "@/components/widgets"
import { CardItem, Warning } from "@/components/shared"
import { PlayerProfileCard } from "@/components/player/card"

const PlayersWidget = async () => {
  const activePlayer = await getPlayer({ isActive: true }, true)

  return (
    <WidgetCard
      widgetLink="/profile/players"
      {...playerProfilesWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3.5">
        Active player profile
      </WidgetSubheader>

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

export default PlayersWidget

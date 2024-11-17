// server
import { getPlayers } from "@/server/db/player"

// constants
import { playersWidget } from "@/constants/dashboard"

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

const PlayersWidgetCard = async () => {
  const players = await getPlayers(true)
  const activePlayer = players.find((player) => player.isActive)

  return (
    <WidgetCard widget={playersWidget}>
      <WidgetActionWrapper>
        <PlayerSelectDrawer players={players} asChild>
          <WidgetQuickAccess />
        </PlayerSelectDrawer>

        <WidgetLink href={playersWidget.href} />
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

export default PlayersWidgetCard

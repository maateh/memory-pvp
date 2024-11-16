// server
import { getPlayer } from "@/server/db/player"

// constants
import { playersWidget } from "@/constants/dashboard"

// components
import { CardItem, Warning } from "@/components/shared"
import { PlayerProfileCard } from "@/components/player/card"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetQuickAccess,
  WidgetSubtitle
} from "@/components/widget"
import { PlayerSelectDrawer } from "../select"

const PlayersWidgetCard = async () => {
  const activePlayer = await getPlayer({ isActive: true }, true)

  return (
    <WidgetCard widget={playersWidget}>
      <WidgetActionWrapper>
        <PlayerSelectDrawer players={[]} asChild>
          <WidgetQuickAccess>
          
          </WidgetQuickAccess>
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

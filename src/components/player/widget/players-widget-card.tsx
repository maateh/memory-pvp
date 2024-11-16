// server
import { getPlayer } from "@/server/db/player"

// constants
import { playersWidget } from "@/constants/dashboard"

// components
import { CardItem, Warning } from "@/components/shared"
import { PlayerProfileCard } from "@/components/player/card"
import { WidgetCard } from "@/components/widget"

const PlayersWidgetCard = async () => {
  const activePlayer = await getPlayer({ isActive: true }, true)

  return (
    <WidgetCard widget={playersWidget}>
      <h4 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
        Active player profile
      </h4>

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

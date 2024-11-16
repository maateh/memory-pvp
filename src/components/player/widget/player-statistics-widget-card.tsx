// server
import { getPlayer } from "@/server/db/player"

// constants
import { playerStatisticsWidget } from "@/constants/dashboard"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubtitle } from "@/components/widget"

const StatisticsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })
  
  return (
    <WidgetCard widget={playerStatisticsWidget}>
      <WidgetSubtitle>
        {player ? <span className="text-accent">{player.tag}&apos;s</span> : 'Player'} statistics
      </WidgetSubtitle>

      <SessionSettingsFilter
        filterService="store"
        filterKey="statistics"
      />
    </WidgetCard>
  )
}

export default StatisticsWidgetCard

// server
import { getPlayer } from "@/server/db/player"

// constants
import { playerStatisticsWidget } from "@/constants/dashboard"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard } from "@/components/widget"

const StatisticsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })
  
  return (
    <WidgetCard widget={playerStatisticsWidget}>
      <h4 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
        {player ? <span className="text-accent">{player.tag}&apos;s</span> : 'Player'} statistics
      </h4>

      <SessionSettingsFilter
        filterService="store"
        filterKey="statistics"
      />
    </WidgetCard>
  )
}

export default StatisticsWidgetCard

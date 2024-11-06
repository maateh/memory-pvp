// server
import { getPlayer } from "@/server/db/player"

// constants
import { playerStatisticsWidgetInfo } from "@/components/widgets/constants"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubheader } from "@/components/widgets"

const PlayerStatisticsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })

  return (
    <WidgetCard {...playerStatisticsWidgetInfo}>
      <WidgetSubheader className="mt-2 mb-0.5">
        Session Settings
      </WidgetSubheader>
      <SessionSettingsFilter
        filterService="store"
        filterKey="statistics"
      />

      <WidgetSubheader className="mt-8 mb-3">
        {player ? <span className="text-accent">{player.tag}&apos;s</span> : 'Player'} statistics
      </WidgetSubheader>

      {/* TODO: show player statistics */}
    </WidgetCard>
  )
}

export default PlayerStatisticsWidgetCard

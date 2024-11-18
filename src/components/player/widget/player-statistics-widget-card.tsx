// server
import { getPlayer } from "@/server/db/player"

// icons
import { ChartArea } from "lucide-react"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubtitle } from "@/components/widget"

const StatisticsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })
  
  return (
    <WidgetCard
      title="Player Statistics"
      description="A brief summary about the statistics of your active player profile."
      Icon={ChartArea}
    >
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

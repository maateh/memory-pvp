// components
import { PlayerStatisticsWidgetCard, PlayersWidgetCard } from "@/components/player/widget"
import { SessionsWidgetCard, WaitingRoomsWidgetCard } from "@/components/session/widget"

const DashboardPage = () => {
  return (
    <div className="page-wrapper widget-container">
      <PlayerStatisticsWidgetCard />
      <PlayersWidgetCard />
      <WaitingRoomsWidgetCard />
      <SessionsWidgetCard />
    </div>
  )
}

export default DashboardPage

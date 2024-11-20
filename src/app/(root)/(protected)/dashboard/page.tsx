// components
import { PlayerProfilesWidgetCard } from "@/components/player/widget"
import { SessionsWidgetCard, WaitingRoomsWidgetCard } from "@/components/session/widget"

const DashboardPage = () => {
  return (
    <div className="page-wrapper widget-container">
      <PlayerProfilesWidgetCard />
      <WaitingRoomsWidgetCard />
      <SessionsWidgetCard />
    </div>
  )
}

export default DashboardPage

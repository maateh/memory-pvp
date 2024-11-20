// components
import { PlayerProfilesWidgetCard } from "@/components/player/widget"
import { SessionsWidgetCard, WaitingRoomsWidgetCard } from "@/components/session/widget"

const DashboardPage = () => {
  return (
    <div className="page-wrapper grid gap-10 xl:grid-cols-2">
      <PlayerProfilesWidgetCard />
      <WaitingRoomsWidgetCard />
      <SessionsWidgetCard />
    </div>
  )
}

export default DashboardPage

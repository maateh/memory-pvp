// components
import { PlayerProfilesWidgetCard } from "@/components/player/widget"
import { RoomJoinWidgetCard } from "@/components/room/widget"
import { SessionsWidgetCard } from "@/components/session/widget"

const DashboardPage = () => {
  return (
    <div className="page-wrapper grid gap-10 xl:grid-cols-2">
      <PlayerProfilesWidgetCard />
      <RoomJoinWidgetCard />
      <SessionsWidgetCard />
    </div>
  )
}

export default DashboardPage

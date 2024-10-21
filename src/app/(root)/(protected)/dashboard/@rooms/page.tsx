// constants
import { waitingRoomsWidgetInfo } from "@/components/widgets/constants"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubheader } from "@/components/widgets"

const WaitingRoomsWidgetCard = async () => {
  // TODO: implement multiplayer & waiting rooms

  return (
    <WidgetCard
      widgetLink="/dashboard/rooms"
      {...waitingRoomsWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3">
        Room Settings
      </WidgetSubheader>

      <SessionSettingsFilter filterKey="rooms" />
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard

// constants
import { waitingRoomsWidgetInfo } from "@/components/widgets/constants" 

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetModal, WidgetSubheader } from "@/components/widgets"

const WaitingRoomsWidgetModal = () => {
  return (
    <WidgetModal {...waitingRoomsWidgetInfo}>
      <WidgetSubheader className="mt-2 mb-3">
        Room Settings
      </WidgetSubheader>

      <SessionSettingsFilter filterKey="rooms" />
    </WidgetModal>
  )
}

export default WaitingRoomsWidgetModal

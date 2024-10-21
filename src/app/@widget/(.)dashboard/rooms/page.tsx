// constants
import { waitingRoomsWidgetInfo } from "@/components/widgets/constants" 

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetModal, WidgetSubheader } from "@/components/widgets"

const WaitingRoomsWidgetModal = () => {
  return (
    <WidgetModal isOpen {...waitingRoomsWidgetInfo}>
      <WidgetSubheader className="mt-2 mb-3">
        Room Settings
      </WidgetSubheader>

      {/* FIXME: add custom filter prefix */}
      <SessionSettingsFilter />
    </WidgetModal>
  )
}

export default WaitingRoomsWidgetModal

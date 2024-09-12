// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants" 

// components
import { WidgetModal } from "@/components/widgets"

const SessionsWidgetModal = async () => {
  // TODO: get game sessions

  return (
    <WidgetModal isOpen {...gameSessionsWidgetInfo}>
      {/* TODO: add a list or a table with filtering & sorting options */}
    </WidgetModal>
  )
}

export default SessionsWidgetModal

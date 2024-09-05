// components (widget modals)
import PlayerProfilesWidgetModal from "@/components/widgets/player-profiles/modal"

// constants (widget info)
import { playerProfilesWidgetInfo } from "@/components/widgets/player-profiles/constants"

const WidgetModalProvider = () => {
  return (
    <>
      <PlayerProfilesWidgetModal {...playerProfilesWidgetInfo} />
    </>
  )
}

export default WidgetModalProvider

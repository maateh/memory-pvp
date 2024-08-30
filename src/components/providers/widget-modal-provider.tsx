// widget-modals
import { ManageAccountWidgetModal } from "@/components/widgets/manage-account"
import { PlayerProfilesWidgetModal } from "@/components/widgets/player-profiles"

const WidgetModalProvider = () => {
  return (
    <>
      <ManageAccountWidgetModal />
      <PlayerProfilesWidgetModal />
    </>
  )
}

export default WidgetModalProvider

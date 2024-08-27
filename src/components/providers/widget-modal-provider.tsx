// widget-modals
import {
  ManageAccountWidgetModal,
  PlayerProfilesWidgetModal
} from "@/components/widget/modals"

const WidgetModalProvider = () => {
  return (
    <>
      <ManageAccountWidgetModal />
      <PlayerProfilesWidgetModal />
    </>
  )
}

export default WidgetModalProvider

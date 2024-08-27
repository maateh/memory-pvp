"use client"

// components
import { WidgetModal } from "@/components/widget"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const PlayerProfilesWidgetModal = () => {
  const { widgetKey, data, isOpen } = useWidgetModal()
  const isModalOpen = isOpen && widgetKey === "playerProfiles"

  return (
    <WidgetModal isOpen={isModalOpen} {...data}>
      PlayerProfiles
    </WidgetModal>
  )
}

export default PlayerProfilesWidgetModal
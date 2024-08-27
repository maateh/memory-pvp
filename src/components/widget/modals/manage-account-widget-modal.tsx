"use client"

// components
import { WidgetModal } from "@/components/widget"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const ManageAccountWidgetModal = () => {
  const { widgetKey, data, isOpen } = useWidgetModal()
  const isModalOpen = isOpen && widgetKey === "manageAccount"

  return (
    <WidgetModal isOpen={isModalOpen} {...data}>
      ManageAccount
    </WidgetModal>
  )
}

export default ManageAccountWidgetModal
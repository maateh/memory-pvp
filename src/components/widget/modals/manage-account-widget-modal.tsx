"use client"

// components
import { WidgetModal } from "@/components/widget"

// hooks
import { useWidget } from "@/hooks/use-widget"

const ManageAccountWidgetModal = () => {
  const { widgetKey, info, isOpen } = useWidget()
  const isModalOpen = isOpen && widgetKey === "manageAccount"

  return (
    <WidgetModal isOpen={isModalOpen} {...info}>
      ManageAccount
    </WidgetModal>
  )
}

export default ManageAccountWidgetModal
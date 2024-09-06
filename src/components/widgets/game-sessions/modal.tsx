"use client"

// constants
import { gameSessionsWidgetInfo } from "./constants"

// components
import { WidgetModal } from "@/components/widgets"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const GameSessionsWidgetModal = () => {
  const {
    widgetKey,
    isOpen
  } = useWidgetModal(({ widgetKey, isOpen }) => ({ widgetKey, isOpen }))
  const isModalOpen = isOpen && widgetKey === "gameSessions"

  return (
    <WidgetModal isOpen={isModalOpen} {...gameSessionsWidgetInfo}>
      {/* TODO: add a list or a table with filtering & sorting options */}
    </WidgetModal>
  )
}

export default GameSessionsWidgetModal

"use client"

// constants
import { gameSessionsWidgetInfo } from "./constants"

// components
import { WidgetCard } from "@/components/widgets"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const GameSessionsWidgetCard = () => {
  const openModal = useWidgetModal((state) => state.openModal)

  return (
    <WidgetCard
      widgetAction={() => openModal('gameSessions')}
      {...gameSessionsWidgetInfo}
    >
      
    </WidgetCard>
  )
}

export default GameSessionsWidgetCard

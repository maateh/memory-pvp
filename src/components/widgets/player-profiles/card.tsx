"use client"

// prisma
import { PlayerProfile } from "@prisma/client"

// components
import { Warning } from "@/components/shared"
import { WidgetCard, type WidgetInfo } from "@/components/widgets"
import PlayerProfileCard from "./player-profile-card"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

type PlayerProfilesWidgetCardProps = {
  activePlayer?: PlayerProfile | null
} & WidgetInfo

const PlayerProfilesWidgetCard = ({ activePlayer, ...widgetProps }: PlayerProfilesWidgetCardProps) => {
  const openModal = useWidgetModal((state) => state.openModal)

  return (
    <WidgetCard
      widgetAction={() => openModal("playerProfiles")}
      {...widgetProps}
    >
      <h4 className="mt-2 mb-4 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Active player profile
      </h4>

      {activePlayer ? (
        <PlayerProfileCard player={activePlayer} />
      ) : (
        <Warning message="Currently, you don't have any player profile." />
      )}
    </WidgetCard>
  )
}

export default PlayerProfilesWidgetCard

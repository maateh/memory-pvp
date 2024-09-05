"use client"

// prisma
import { PlayerProfile } from "@prisma/client"

// constants
import { playerProfilesWidgetInfo } from "./constants"

// components
import { Warning } from "@/components/shared"
import { WidgetCard } from "@/components/widgets"
import PlayerProfileCard from "./player-profile-card"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

type PlayerProfilesWidgetCardProps = {
  activePlayer?: PlayerProfile | null
}

const PlayerProfilesWidgetCard = ({ activePlayer }: PlayerProfilesWidgetCardProps) => {
  const openModal = useWidgetModal((state) => state.openModal)

  return (
    <WidgetCard
      widgetAction={() => openModal("playerProfiles")}
      {...playerProfilesWidgetInfo}
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

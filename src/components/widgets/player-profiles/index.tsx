// trpc
import { api } from "@/trpc/server"

// constants
import { playerProfilesWidgetInfo } from "./constants"

// components
import PlayerProfilesWidgetCard from "./card"
import PlayerProfilesWidgetModal from "./modal"

const PlayerProfilesWidget = async () => {
  const user = await api.user.getWithPlayerProfiles()
  const activePlayer = user?.playerProfiles.find((player) => player.isActive)

  return (
    <>
      <PlayerProfilesWidgetCard
        activePlayer={activePlayer}
        {...playerProfilesWidgetInfo}
      />

      <PlayerProfilesWidgetModal
        players={user?.playerProfiles || []}
        {...playerProfilesWidgetInfo}
      />
    </>
  )
}

export default PlayerProfilesWidget

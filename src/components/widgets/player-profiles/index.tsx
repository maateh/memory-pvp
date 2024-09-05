// trpc
import { api } from "@/trpc/server"

// constants
import { playerProfilesWidgetInfo } from "./constants"

// components
import PlayerProfilesWidgetCard from "./card"

const PlayerProfilesWidget = async () => {
  const activePlayer = await api.playerProfile.getActive()

  return (
    <PlayerProfilesWidgetCard
      activePlayer={activePlayer}
      {...playerProfilesWidgetInfo}
    />
  )
}

export default PlayerProfilesWidget

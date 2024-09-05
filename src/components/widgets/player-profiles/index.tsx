// trpc
import { api } from "@/trpc/server"

// components
import PlayerProfilesWidgetCard from "./card"

const PlayerProfilesWidget = async () => {
  const activePlayer = await api.playerProfile.getActive()

  return (
    <PlayerProfilesWidgetCard
      activePlayer={activePlayer}
    />
  )
}

export default PlayerProfilesWidget

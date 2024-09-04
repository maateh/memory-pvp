// trpc
import { api } from "@/trpc/server"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { type WidgetInfo } from "@/components/widgets"
import PlayerProfilesWidgetCard from "./card"
import PlayerProfilesWidgetModal from "./modal"

export const widgetInfo: WidgetInfo = {
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want.",
  icon: <Gamepad2 />
}

const PlayerProfilesWidget = async () => {
  const user = await api.user.getWithPlayerProfiles()
  const activePlayer = user?.playerProfiles.find((player) => player.isActive)

  return (
    <>
      <PlayerProfilesWidgetCard
        activePlayer={activePlayer}
        {...widgetInfo}
      />

      <PlayerProfilesWidgetModal
        players={user?.playerProfiles || []}
        {...widgetInfo}
      />
    </>
  )
}

export default PlayerProfilesWidget

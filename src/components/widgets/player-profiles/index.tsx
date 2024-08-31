// trpc
import { api } from "@/trpc/server"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { type WidgetInfo } from "@/components/widgets"
import PlayerProfilesWidgetCard from "./card"
import PlayerProfilesWidgetModal from "./modal"

const widgetInfo: WidgetInfo = {
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want.",
  icon: <Gamepad2 />
}

const PlayerProfilesWidget = async () => {
  const userWithPlayers = await api.user.getWithPlayerProfiles()

  const activePlayerProfile = userWithPlayers?.playerProfiles.find(
    (player) => player.isActive
  )

  return (
    <>
      <PlayerProfilesWidgetCard
        playerProfiles={userWithPlayers?.playerProfiles}
        activePlayerProfile={activePlayerProfile}
        {...widgetInfo}
      />

      <PlayerProfilesWidgetModal
        user={userWithPlayers}
        {...widgetInfo}
      />
    </>
  )
}

export default PlayerProfilesWidget

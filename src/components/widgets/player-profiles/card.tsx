// trpc
import { api } from "@/trpc/server"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { Warning } from "@/components/shared"
import { WidgetCard } from "@/components/widgets"
import PlayerProfileCard from "./player-profile-card"

const PlayerProfilesWidgetCard = async () => {
  const userWithPlayers = await api.user.getWithPlayerProfiles()

  const activePlayerProfile = userWithPlayers?.playerProfiles.find(
    (player) => player.isActive
  )

  return (
    <WidgetCard<UserWithPlayerProfiles>
      widgetKey="playerProfiles"
      title="Player Profiles"
      description="Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
      icon={<Gamepad2 />}
      data={userWithPlayers}
    >
      <h4 className="mt-2 mb-4 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Active player profile
      </h4>

      {activePlayerProfile ? (
        <PlayerProfileCard player={activePlayerProfile} />
      ) : (
        <Warning message="Currently, you don't have any player profile." />
      )}
    </WidgetCard>
  )
}

export default PlayerProfilesWidgetCard

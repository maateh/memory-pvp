// trpc
import { api } from "@/trpc/server"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { WidgetCard } from "@/components/widget"

const PlayerProfilesWidgetCard = async () => {
  const players = await api.player.getAll()

  return (
    <WidgetCard<PlayerWithProfile[]>
      widgetKey="playerProfiles"
      title="Player Profiles"
      description="Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
      icon={<Gamepad2 />}
      data={players}
    >
      <div>Current player profiles</div>
    </WidgetCard>
  )
}

export default PlayerProfilesWidgetCard

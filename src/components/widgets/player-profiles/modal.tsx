"use client"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileForm } from "@/components/form"
import { WidgetModal } from "@/components/widgets"
import PlayerDetailsCard from "./player-details-card"

// hooks
import { useWidget } from "@/hooks/use-widget"

const PlayerProfilesWidgetModal = () => {
  const { widgetKey, info, isOpen, data: userWithPlayers } = useWidget<UserWithPlayerProfiles>()
  const isModalOpen = isOpen && widgetKey === "playerProfiles"

  return (
    <WidgetModal isOpen={isModalOpen} {...info}>
      <div className="space-y-8">
        <h4 className="text-lg font-heading font-bold small-caps">
          Create a new player profile
        </h4>

        <PlayerProfileForm />
      </div>

      <Separator className="w-11/12 my-2.5 mx-auto bg-border/60" />

      <h4 className="text-lg font-heading font-bold small-caps">
        Manage your current profiles
      </h4>

      <ScrollArea className="max-h-60 pr-4">
        <ul className="flex flex-col gap-y-1">
          {userWithPlayers?.playerProfiles?.map((player) => (
            <li key={player.id}>
              <PlayerDetailsCard player={player} />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </WidgetModal>
  )
}

export default PlayerProfilesWidgetModal

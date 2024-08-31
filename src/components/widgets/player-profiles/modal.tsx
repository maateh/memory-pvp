"use client"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileForm } from "@/components/form"
import { WidgetModal } from "@/components/widgets"

// hooks
import { useWidget } from "@/hooks/use-widget"
import PlayerProfileList from "./player-profile-list"

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

      <PlayerProfileList
        players={userWithPlayers?.playerProfiles || []}
      />
    </WidgetModal>
  )
}

export default PlayerProfilesWidgetModal

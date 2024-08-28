"use client"

// components
import { PlayerProfileForm } from "@/components/form"
import { PlayerProfileFormValues } from "@/components/form/player-profile-form"
import { Separator } from "@/components/ui/separator"
import { WidgetModal } from "@/components/widget"

// hooks
import { useWidget } from "@/hooks/use-widget"

const PlayerProfilesWidgetModal = () => {
  const { widgetKey, info, isOpen, data: profiles } = useWidget<PlayerProfileFormValues[]>()
  const isModalOpen = isOpen && widgetKey === "playerProfiles"

  return (
    <WidgetModal isOpen={isModalOpen} {...info}>
      <div className="space-y-8">
        <h4 className="text-lg font-heading font-bold small-caps">
          Create a new player profile
        </h4>

        <PlayerProfileForm />
      </div>

      <Separator className="w-11/12 my-6 mx-auto bg-border/60" />

      <h4 className="text-lg font-heading font-bold small-caps">
        Manage your current profiles
      </h4>

      TODO: profile list
    </WidgetModal>
  )
}

export default PlayerProfilesWidgetModal

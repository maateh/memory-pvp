"use client"

// components
import { PlayerProfileForm } from "@/components/form"
import { Separator } from "@/components/ui/separator"
import { WidgetModal } from "@/components/widget"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const PlayerProfilesWidgetModal = () => {
  const { widgetKey, data, isOpen } = useWidgetModal()
  const isModalOpen = isOpen && widgetKey === "playerProfiles"

  return (
    <WidgetModal isOpen={isModalOpen} {...data}>
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

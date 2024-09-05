"use client"

// trpc
import { api } from "@/trpc/client"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileForm } from "@/components/form"
import { WidgetModal, type WidgetInfo } from "@/components/widgets"
import PlayerProfileList from "./player-profile-list"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

const PlayerProfilesWidgetModal = ({ ...props }: WidgetInfo) => {
  const { widgetKey, isOpen } = useWidgetModal()
  const isModalOpen = isOpen && widgetKey === "playerProfiles"

  const { data: players, isLoading } = api.playerProfile.getAll.useQuery()

  return (
    <WidgetModal isOpen={isModalOpen} {...props}>
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

      {isLoading ? (
        <>TODO: loading skeleton</>
      ) : (
        <PlayerProfileList players={players} />
      )}
    </WidgetModal>
  )
}

export default PlayerProfilesWidgetModal

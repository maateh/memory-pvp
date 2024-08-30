// components
import { ManageAccountWidgetCard } from "@/components/widgets/manage-account"
import { PlayerProfilesWidgetCard } from "@/components/widgets/player-profiles"

const ProfilePage = () => {
  // - manage profile
  // - manage player accounts

  return (
    <div className="m-4 mb-8 grid gap-x-12 gap-y-16 xl:grid-cols-2 xl:mx-4">
      <ManageAccountWidgetCard />

      <PlayerProfilesWidgetCard />
    </div>
  )
}

export default ProfilePage

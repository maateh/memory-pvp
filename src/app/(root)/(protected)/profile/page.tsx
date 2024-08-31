// components
import ManageAccountWidget from "@/components/widgets/manage-account"
import PlayerProfilesWidget from "@/components/widgets/player-profiles"

const ProfilePage = () => {
  // - manage profile
  // - manage player accounts

  return (
    <div className="m-4 mb-8 grid gap-x-12 gap-y-16 xl:grid-cols-2 xl:mx-4">
      <ManageAccountWidget />

      <PlayerProfilesWidget />
    </div>
  )
}

export default ProfilePage

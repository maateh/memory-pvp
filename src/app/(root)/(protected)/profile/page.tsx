// icons
import { UserCircle, Gamepad2 } from "lucide-react"

// components
import { WidgetCard, WidgetModal } from "@/components/widget"

const ProfilePage = () => {
  // - manage profile
  // - manage player accounts

  return (
    <div className="m-4 mb-8 grid gap-x-12 gap-y-16 xl:grid-cols-2 xl:mx-4">
      <WidgetCard className="h-max"
        widgetKey="account"
        title="Your Account"
        description="Manage your account with Clerk."
        Icon={UserCircle}
      >
        <div>Display account info</div>
      </WidgetCard>

      <WidgetModal
        widgetKey="account"
        title="Your Account"
        description="Manage your account with Clerk."
        Icon={UserCircle}
      />

      <WidgetCard className="h-max"
        widgetKey="player"
        title="Player Profiles"
        description="Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
        Icon={Gamepad2}
      >
        <div>Current accounts</div>
      </WidgetCard>
    </div>
  )
}

export default ProfilePage

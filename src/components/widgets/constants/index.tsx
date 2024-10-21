// types
import type { WidgetInfo } from "@/components/widgets/types"

// icons
import { Gamepad2, History, UserCircle } from "lucide-react"

// DASHBOARD
export const sessionHistoryWidgetInfo: WidgetInfo = {
  title: "Session History",
  description: "Browse through your previous game sessions.",
  icon: <History />
}

// PROFILE
export const manageAccountWidgetInfo: WidgetInfo = {
  title: "Your Account",
  description: "Manage your account with Clerk.",
  icon: <UserCircle />
}

export const playerProfilesWidgetInfo: WidgetInfo = {
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want.",
  icon: <Gamepad2 />
}
